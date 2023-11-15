from flask import Flask, request, Request, Response, make_response, abort, jsonify, render_template, redirect
from hashlib import shake_256, shake_128
from sqlite3 import connect
from utils.db_utils import (ensure_created_db, get_user_session, try_login, check_username, register_new_user,
                            get_my_profile, get_all_profiles, check_for_admin)


app = Flask(__name__)

__db_name = 'users.db'
cached_access_tokens: dict[int, dict[str, str | int]] = {}
ensure_created_db(__db_name)


def authenticate(user_id: int, hashed_passw: str) -> Response:
    access_token = shake_128(hashed_passw.encode()).hexdigest(5)
    resp = make_response(jsonify({"status": "Success", "user_id": user_id, "token": access_token}), 200)
    resp.set_cookie("user_id", str(user_id))
    resp.set_cookie("token", access_token)
    return resp


def check_access(req: Request) -> bool:
    token = req.cookies.get('token')
    user_id = req.cookies.get('user_id', type=int)
    if user_id in cached_access_tokens:
        if cached_access_tokens[user_id]['ctr'] > 0 and cached_access_tokens[user_id]['token'] == token:
            cached_access_tokens[user_id]['ctr'] -= 1
            return True
        else:
            cached_access_tokens.pop(user_id, 0)
    else:
        conn = connect(__db_name)
        is_correct = (token and user_id and get_user_session(conn, user_id) == token)
        conn.close()
        if is_correct:
            cached_access_tokens[user_id] = {'token': token, 'ctr': 10}
        return is_correct


@app.route('/')
def index():
    if check_access(request):
        return redirect("/profiles", code=302)
    else:
        return redirect("/login", code=302)


@app.route('/login')
def to_login():
    return render_template('login-form.html')


@app.route('/signup')
def to_signup():
    return render_template('signup-form.html')


@app.route('/profiles')
def to_profiles():
    return render_template('profiles.html')


@app.post('/api/log-in')
def login():
    hashed_passw = shake_256(request.form['passwd'].encode()).hexdigest(10)
    conn = connect(__db_name)
    user_id = try_login(conn, request.form['username'], hashed_passw)
    conn.close()
    if user_id:
        return authenticate(user_id, hashed_passw)
    else:
        return jsonify({"status": "Failed"})


@app.post('/api/sign-up')
def signup():
    conn = connect(__db_name)
    username_available = check_username(conn, request.form['login'])
    if username_available:
        hashed_passw = shake_256(request.form['passwd'].encode()).hexdigest(10)
        user_id = register_new_user(conn, request.form['login'], hashed_passw, request.form['full_name'],
                                    int(request.form['id_card']), request.form['faculty'], request.form['birthdate'],
                                    request.form['address'])
        conn.close()
        return authenticate(user_id, hashed_passw)
    else:
        conn.close()
        abort(400)


@app.get('/api/sign-up/<string:username>')
def check_username_availability(username: str):
    conn = connect(__db_name)
    username_availability = check_username(conn, username)
    conn.close()
    return jsonify({"available": username_availability})


@app.get('/api/my-profile')
async def get_my_profile_info():
    if check_access(request):
        user_id = request.cookies.get('user_id', type=int)
        conn = connect(__db_name)
        profile: dict[str, str | int] = get_my_profile(conn, user_id)
        conn.close()
        return jsonify(profile)
    else:
        abort(401)


@app.get('/api/profiles')
async def get_profiles():
    if check_access(request):
        user_id = request.cookies.get('user_id', type=int)
        conn = connect(__db_name)
        if check_for_admin(conn.cursor(), user_id):
            profiles: list[dict[str, str | int]] = get_all_profiles(conn)
            conn.close()
            return jsonify(profiles)
        else:
            conn.close()
            abort(403)
    else:
        abort(401)


if __name__ == '__main__':
    app.run("0.0.0.0", port=3000, debug=False)
