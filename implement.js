let tableObj = document.createElement('table');
    tableObj.setAttribute('id','table');
    tableObj.style.width = '100%';
    tableObj.setAttribute('border','1');

let tableBody = document.createElement('tbody');
function loadJSON(addFlag) {
        let jsonRes = [];

        let responsePromise = getJSON('PUT','http://www.mocky.io/v2/5dd658fe320000a815888958',true);
        responsePromise.then(function(result) {
            if(addFlag) {
                let json = [];
                json.push(addJSON());
                tableBody = addRow(json);
            } 
            else {
                jsonRes = JSON.parse(result);
                tableBody = addRow(jsonRes);
            }    
         }, function(error) {
            alert(error);
         });
         let resultObj = document.getElementById('result');

        tableObj.appendChild(tableBody);
        resultObj.appendChild(tableObj);
        document.getElementById('load').disabled = true;
}

function addRow(jsonRes) {
    jsonRes.forEach(element => {
        let data = '';
        let rowObj = document.createElement('tr');
        let dataObj = document.createElement('td');
        dataObj.setAttribute('style','width:73%');
        for (const key in element) {
            data = document.createTextNode(element[key]);
            dataObj.appendChild(data);
            dataObj.appendChild(document.createElement('br'));
            rowObj.appendChild(dataObj);
        }

        let editButton = editBtn();
        let delButton = delBtn();

        let buttonObj = document.createElement('td');
        buttonObj.setAttribute('float','right');
        buttonObj.appendChild(editButton);
        buttonObj.appendChild(delButton);

        rowObj.appendChild(buttonObj);
        tableBody.appendChild(rowObj);
    });
    return tableBody;
}

function editBtn() {
    var btn = document.createElement("BUTTON");
    var edit = document.createTextNode("EDIT");
    btn.appendChild(edit);

    btn.onclick = function() { 
        let rowNo = this.parentNode.parentNode.rowIndex;
        var title = prompt("Enter the Title : ");  
        var desc = prompt("Enter the Description about the title : ");
        if(title === null || desc === null) {
            alert("Please Enter some value...");
            return;
        }
        else {
            let testTable = document.getElementById('table');
            testTable.rows[rowNo].cells[0].innerText = title +"\n"+desc;
        }
    };
    return btn;
  }

  function delBtn() {
    var btn = document.createElement("BUTTON");
    var del = document.createTextNode("DELETE");
    btn.appendChild(del);

    btn.onclick = function() { 
        //to find row number in the given table
        let rowNo = this.parentNode.parentNode.rowIndex;
        if(confirm("Are you sure to DELETE this row : "+rowNo)) {
            //to delete row based on row number
            document.getElementById('table').deleteRow(rowNo);
        }
    };    
    return btn;
  }

  function addJSON() {
    let title = prompt("Enter the Title : ");  
    let desc = prompt("Enter the Description about the title : ");
    if(title === null || desc === null) {
        alert("Please Enter some value...");
        addJSON();
    }
    else {
        let data = {"title" : title,"description" : desc};
    }
    return data;
  }

