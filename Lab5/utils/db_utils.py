from sqlite3 import Cursor, Connection, connect
from hashlib import shake_128


def ensure_created_db(db_name: str) -> None:
    connection = connect(db_name)
    cursor: Cursor = connection.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT(20) UNIQUE,
    hashed_password TEXT(20),
    is_admin TINYINT DEFAULT 0,
    full_name TEXT(50) NOT NULL,
    id_card INTEGER NOT NULL,
    faculty TEXT(4) NOT NULL,
    birthdate TEXT(10) NOT NULL,
    address TEXT(50) NOT NULL
    )
    ''')

    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_login ON Users (login)')

    connection.commit()
    connection.close()


def check_for_admin(crs: Cursor, user_id: int) -> bool:
    crs.execute(f'SELECT is_admin FROM Users WHERE user_id = ?', (user_id,))
    return crs.fetchone()[0] == 1


def register_new_user(connection: Connection, login: str, hashed_passwd: str, full_name: str, id_card: int, faculty: str, birthdate: str, address: str) -> int:
    crs: Cursor = connection.cursor()
    crs.execute(f'INSERT INTO Users(login, hashed_password, is_admin, full_name, id_card, faculty, birthdate, address) VALUES (?, ?, 0, ?, ?, ?, ?, ?)',
                (login, hashed_passwd, full_name, id_card, faculty, birthdate, address))
    connection.commit()

    crs.execute(f'SELECT user_id FROM Users WHERE login = ? AND hashed_password = ?',
                (login, hashed_passwd))
    return crs.fetchone()[0]


def update_user(connection: Connection, user_id: int, login: str, full_name: str, id_card: int, faculty: str, birthdate: str, address: str) -> int:
    crs: Cursor = connection.cursor()
    crs.execute(f'UPDATE Users SET login = ?, full_name = ?, id_card = ?, faculty = ?, birthdate = ?, address = ? WHERE user_id = ?',
                (login, full_name, id_card, faculty, birthdate, address, user_id))
    connection.commit()

    crs.execute(f'SELECT user_id FROM Users WHERE login = ?',
                (login, ))
    return crs.fetchone()[0]


def update_passwd(connection: Connection, user_id: int, hashed_passwd: str) -> None:
    crs: Cursor = connection.cursor()
    crs.execute(f'UPDATE Users SET hashed_password = ? WHERE user_id = ?',
                (hashed_passwd, user_id))
    connection.commit()


def try_login(connection: Connection, login: str, hashed_passwd: str) -> int | None:
    crs: Cursor = connection.cursor()

    crs.execute(f'SELECT user_id FROM Users WHERE login = ? AND hashed_password = ?',
                (login, hashed_passwd))
    res = crs.fetchall()
    return None if len(res) == 0 else res[0][0]


def check_username(connection: Connection, login: str) -> bool:
    crs: Cursor = connection.cursor()

    crs.execute(f'SELECT user_id FROM Users WHERE login = ?',
                (login,))
    res = crs.fetchall()
    return len(res) == 0


def get_user_session(connection: Connection, user_id: int) -> str|None:
    crs: Cursor = connection.cursor()

    crs.execute(f'SELECT hashed_password FROM Users WHERE user_id = ?',
                (user_id,))
    res = crs.fetchall()
    return shake_128(res[0][0].encode()).hexdigest(5) if len(res) > 0 else None


def make_admin(connection: Connection, user_id: int):
    crs: Cursor = connection.cursor()
    crs.execute(f'UPDATE Users SET is_admin = 1 WHERE user_id = ?', (user_id,))
    connection.commit()


def get_all_profiles(connection: Connection) -> list[dict[str, str | int]]:
    crs = connection.cursor()
    crs.execute(
        f'''SELECT user_id, login, hashed_password, is_admin, full_name, id_card, faculty, birthdate, address
        FROM Users
        ORDER BY user_id''')
    return [{'user_id': user_id, 'login': login, 'hashed_passwd': hashed_password, 'is_admin': is_admin == 1,
             'full_name': full_name, 'id_card': id_card, 'faculty': faculty, 'birthdate': birthdate, 'address': address}
            for user_id, login, hashed_password, is_admin, full_name, id_card, faculty, birthdate, address
            in crs.fetchall()]


def get_my_profile(connection: Connection, user_id: int) -> dict[str, str | int]:
    crs = connection.cursor()
    crs.execute(
        f'''SELECT user_id, login, hashed_password, is_admin, full_name, id_card, faculty, birthdate, address
        FROM Users
        WHERE user_id = ?
        LIMIT 1''',
        (user_id,))

    user_id, login, hashed_password, is_admin, full_name, id_card, faculty, birthdate, address = crs.fetchone()
    return {'user_id': user_id, 'login': login, 'is_admin': is_admin == 1,
            'full_name': full_name, 'id_card': id_card, 'faculty': faculty, 'birthdate': birthdate, 'address': address}


def delete_users_profile(connection: Connection, user_id: int):
    crs = connection.cursor()
    crs.execute(
        f'''DELETE FROM Users WHERE user_id=?''', (user_id,))
    connection.commit()


if __name__ == '__main__':
    ensure_created_db('users.db')
