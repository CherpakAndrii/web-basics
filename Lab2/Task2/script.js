const tableWidth = 6;
const tableHeight = 6;

function CreateTable(){
	let content = "<div id='table-container'><table id='colored-table'>";
	for (let i = 0; i < tableHeight; i++) {
		content += "<tr>"
		for (let j = 0; j < tableWidth; j++) {
			content += "<td id='td-"+i+'-'+j+"'>" + (i*tableWidth+j+1) + "</td>"
		}
		content += "</tr>"
	}
	content += "</table></div>"
	document.body.innerHTML += content;
}

CreateTable();

function SetRandomColor(cell){
	console.log('set random color launched');
	let randomColorAsNum = Math.floor(Math.random()*16777215); //borrowed from https://css-tricks.com/snippets/javascript/random-hex-color/
	this.style.background = '#'+(randomColorAsNum.toString(16));
	this.style.color = ((randomColorAsNum % 256 + (randomColorAsNum / 256) % 256 + randomColorAsNum / 65536) / 3 < 164 ? '#fff' : '#000');
}

function SetSelectedColor(cell){
	console.log('set selected color launched');
	let color = document.getElementById('selected-color').value;
	this.style.background = color;
}

function SetDiagonalColor(cell){
	let color = document.getElementById('selected-color').value;
	for (let i = 0; i < 6; i++){
		document.getElementById(`td-${i}-${5-i}`).style.background = color;
	}
}

function SetEventHandlers(cellIndex){
	if (cellIndex < 0 || cellIndex >= tableHeight * tableWidth)
	{
		throw (new RangeError("Index "+(cellIndex)+" is out of tables range [0, "+(tableHeight * tableWidth)+")"))
	}
	let targetCell = document.getElementById(`td-${Math.floor(cellIndex/tableWidth)}-${cellIndex%tableWidth}`);
	targetCell.onmouseover = SetRandomColor;
	targetCell.onclick = SetSelectedColor;
	targetCell.ondblclick = SetDiagonalColor
}

SetEventHandlers(3);
