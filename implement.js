let result = document.getElementById('result');
let error = document.getElementById('empty');

let jsonRes = [];
let objNum = 0;
/**
 * call API and process with returned response
 */
let loadJSONBtn = function() {
    let responsePromise = getJSON('PUT','http://www.mocky.io/v2/5df205773100007c009a2f1d',true);
    responsePromise.then(function(result) {
        let jsonArray = JSON.parse(result);
        jsonArray.forEach(element => {
            jsonRes.push(element);
        });
        addJson(jsonArray);
        document.getElementById('load').disabled = true;
    }), 
    function(error) {
        alert(error);
    };
}

/**
 * Function to add title and description to the current data
 */
let addButton = function() {
    document.getElementById('add').disabled = true;
    updateJson();
}

/**
 * Remove the checked objects from the DOM
 */
let multipleDeleteBtn = function() {
    let checkboxes = getCheckedCheckboxesFor('object');
    if(checkboxes[0] === null || checkboxes[0] === '' || checkboxes[0] === undefined) {
        alert("Check the rows to be deleted...");
    }
    else {
        if(confirm("Delete Selected rows...")) {
            checkboxes.forEach(checkbox => {
                document.getElementById(checkbox).remove();
            });
        }
    }
}

/**
 * create a div container to hold checkbox, JSON and actions
 * @param {json array} jsonRes 
 */
let addJson = function(jsonRes) { 
    jsonRes.forEach(element => {
        objNum++;
        cloneFlag = '';
        //create separate div for each object and assigned a class 'content'
        let divUL = document.createElement('div');
        divUL.setAttribute('id',objNum);
        divUL.setAttribute('class','content');

        let input = getInputElt();
        let dataLI = dataBar(element, objNum, '65%');
        let actionLI = actionBar(objNum);

        //adding checkboxes, data, actions in a div
        divUL.appendChild(input);
        divUL.appendChild(dataLI);
        divUL.appendChild(actionLI);

        //adding div to resultant div
        result.appendChild(divUL);
        document.getElementById('add').disabled = false;
    });
}

/**
 * To edit the current Json data
 */
let tFlag = 'false';
let dFlag = 'false';
let editBtn = function(objNumber) {
    var btn = document.createElement("BUTTON");
    var edit = document.createTextNode("EDIT");
    btn.appendChild(edit);

    btn.onclick = function() {
        let parentDiv = this.parentElement.parentElement;
        let parentId = parentDiv.id;

        let tDiv = document.getElementById('titleSpan'+parentId).innerHTML;
        let dDiv = document.getElementById('descSpan'+parentId).innerHTML;

        let div = editFunction(tDiv, dDiv, parentDiv);
        //adding data in a div
        parentDiv.innerHTML = '';
        parentDiv.appendChild(div);
    }
    return btn;
}

let editFunction = function(tit, desc, parentDiv) {
    let parentId = parentDiv.id;
    let div = document.createElement("div");
    div.setAttribute('style','width:100%');
    div.setAttribute('id','edit'+parentId);
   
    let dataDiv = document.createElement('div');
    dataDiv.setAttribute('style','width:66%; float:left');
    let titleDiv = document.createElement('div');
    titleDiv.setAttribute('id','editTDiv');
    let title = document.createElement("input"); 
    title.setAttribute('type',"text");
    title.setAttribute('name',"title");
    title.setAttribute('id','etitle');
    title.setAttribute('value',tit);
    let tData = document.createTextNode('TITLE : ');
    titleDiv.appendChild(tData);
    titleDiv.appendChild(title);

    let descDiv = document.createElement('div');
    descDiv.setAttribute('id','editDDiv');
    let description = document.createElement("textarea"); 
    description.setAttribute('id','edesc');
    description.innerHTML = desc;
    let dData = document.createTextNode('DESC : ');
    descDiv.appendChild(dData);
    descDiv.appendChild(description);

    let actionDiv = document.createElement('div');
    actionDiv.setAttribute('style','float: right; width: 32%; margin-top: 40px');
    //button to add new json
    let editButton = document.createElement("button");
    let btnData = document.createTextNode("UPDATE");
    editButton.appendChild(btnData);
    editButton.addEventListener('click', function() {
        eUpdateBtn(parentDiv);
    });

    //button to cancel 
    let cancelBtn = document.createElement('button');
    let cancelData = document.createTextNode('CANCEL');
    cancelBtn.appendChild(cancelData);
    cancelBtn.addEventListener('click', function() {
        eCancelBtn(tit, desc, parentDiv);
    })

    dataDiv.appendChild(titleDiv);
    dataDiv.appendChild(descDiv);
    actionDiv.appendChild(editButton);
    actionDiv.appendChild(cancelBtn);

    div.appendChild(dataDiv);
    div.appendChild(actionDiv);

    return div;
}

let titFlag = 'false';
let desFlag = 'false';
let eUpdateBtn = function(parentDiv) {
    debugger;
    let title = document.getElementById('etitle').value;
    let desc = document.getElementById('edesc').value;
    let data = {"title" : title,"description" : desc};

    let parentId = parentDiv.id;
    let titleDiv = document.getElementById('editTDiv');
    let descDiv = document.getElementById('editDDiv');
    jsonRes[parentId-1] = data;

    let titleLen = titleDiv.children.length;
    let descLen = descDiv.children.length;

    //removing the form from the DOM and replacing with new object
    if(title === '' && desc === '') {
        error.style.display = 'block';
        if(titleLen === 1) {
            titleDiv.appendChild(error);
            titFlag = 'true';
        }
        if(descLen === 1) {
            descDiv.appendChild(error.cloneNode(true));
            desFlag = 'true';
        }
    }
    else if(title === '' || desc === '') {
        if(title === '') {
            error.style.display = 'block';
            if(titleLen === 1) {
                titleDiv.appendChild(error);
                titFlag = 'true';
            }
            if(descLen > 2 && desFlag === 'true') {
                descDiv.removeChild(descDiv.lastChild);
                desFlag = 'false';
            }
        }
        else if(desc === '') {
            error.style.display = 'block';
            if(titleLen > 2 && titFlag === 'true') {
                titleDiv.removeChild(titleDiv.lastChild);
                titFlag = 'false';
            }
            if(descLen === 1) {
                descDiv.appendChild(error);
                desFlag = 'true';
            }
        }
    }
    else {
        parentDiv.innerHTML = '';
        let dataDiv = dataBar(data, parentId, '100%');
        dataDiv.setAttribute('style','width:65%');
        let actionDiv = actionBar(parentId);
        let input = getInputElt();
        parentDiv.appendChild(input);
        parentDiv.appendChild(dataDiv);
        parentDiv.appendChild(actionDiv);
    }
}

let eCancelBtn = function(title, desc, parentDiv) {
    let parentId = parentDiv.id;
    let data = {"title" : title,"description" : desc};
    let dataDiv = dataBar(data, parentId, '68%');
    let actionDiv = actionBar(parentId);
    let input = getInputElt();
    parentDiv.innerHTML = '';
    parentDiv.appendChild(input);
    parentDiv.appendChild(dataDiv);
    parentDiv.appendChild(actionDiv);
}

/**
 * To delete the current Json Div
 */
let delBtn = function(objNumber) {
    //create delete button
    var btn = document.createElement("BUTTON");
    var del = document.createTextNode("DELETE");
    btn.setAttribute('id','delbtn'+objNumber);
    btn.appendChild(del);

    btn.onclick = function() { 
        //get parent div ID
        let parentId = this.parentElement.parentElement.id;
        let title = document.getElementById('titleSpan'+parentId);

        if(confirm("Delete "+title.innerText)) {
            let parentDiv = this.parentElement.parentElement;
            parentDiv.remove();
        }
    };    
    return btn;
}

/**
 * Update the JSON with new object(title and description)
 */
let updateJson = function() {
    objNum++;
    setCancelBtn(objNum);
    setUpdateFlag(objNum);
    
    //container for new json object
    let div = document.createElement('div');
    div.setAttribute('id',objNum);
    div.setAttribute('class','content');

  //button to add new json
    var addButton = document.createElement("button");
    var btnData = document.createTextNode("ADD");
    addButton.appendChild(btnData);
    addButton.setAttribute('onclick','updateBtn()');

    //button to cancel 
    var cancelBtn = document.createElement('button');
    var cancelData = document.createTextNode('CANCEL');
    cancelBtn.appendChild(cancelData);
    cancelBtn.setAttribute('onclick','cancelButton()');

    let form = createForm();
    div.appendChild(form);
    div.appendChild(addButton);
    div.appendChild(cancelBtn);

    //adding div to resultant div
    result.appendChild(div);
}

let updateFlag;
let setUpdateFlag = function(flag) {
    updateFlag = flag;
}

let getUpdateFlag = function() {
    return updateFlag;
}

/**
 * returns checkbox values that are checked
 */
let getCheckedCheckboxesFor = function(checkboxName) {
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function(elt) {
        values.push(elt.value);
    });
    return values;
}

/**
 * return input field of checkbox type
 */
let getInputElt = function() {
    let input = document.createElement('input');
    input.setAttribute('name','object');
    input.setAttribute('type','checkbox');
    input.setAttribute('value',objNum);
    input.setAttribute('style','margin:5px');
    return input;
}

/**
 * returns div that contains object with bold title and description
 * @param element - object to be added 
 */
let dataBar = function(element, objNum, divWidth) {
    //create a span element for displaying data 
    let div = document.createElement('div');
    div.setAttribute('id','id'+objNum);
    div.style.width = divWidth;

    //traversing the response object and making the title bold
    for (const key in element) {
        data = document.createTextNode(element[key]);
        if(key === 'title') {
            var span = document.createElement('span');
            span.setAttribute('id','titleSpan'+objNum);
            span.style.fontWeight = 'bold';
            span.style.fontSize = '19px';
            span.appendChild(data);
            div.appendChild(span);
        }
        else {
            let descDiv = document.createElement('div');
            descDiv.setAttribute('id','descSpan'+objNum);
            descDiv.appendChild(data);
            div.appendChild(descDiv);
        }
    }
    document.getElementById('add').disabled = false;
    return div;
}

/**
 * returns action span that contains Edit and Delete buttons
 */
let actionBar = function(objNumber) {
    //create span for holding Buttons
    let span = document.createElement('span');
    span.setAttribute('style','width:33%');
    span.style.cssFloat='right';

    //calling methods that returns Edit and Delete Buttons
    let editButton = editBtn(objNumber);
    let delButton = delBtn(objNumber);

    span.appendChild(editButton);
    span.appendChild(delButton);
    return span;
}

/**
 * returns form that has title and description input field of type text
 */
let createForm = function() {
    var div = document.createElement("form");
    div.setAttribute('style','width:68%');
    div.setAttribute('id','createForm'+objNum);
    
    var titleDiv = document.createElement('div');
    titleDiv.setAttribute('id','td');
    var title = document.createElement("input"); 
    title.setAttribute('type',"text");
    title.setAttribute('name',"title");
    title.setAttribute('id','title');
    var tData = document.createTextNode('TITLE : ');
    titleDiv.appendChild(tData);
    titleDiv.appendChild(title);

    var descDiv = document.createElement('div');
    descDiv.setAttribute('id','dd');
    var description = document.createElement("textarea"); 
    description.setAttribute('id','desc');
    var dData = document.createTextNode('DESC : ');
    descDiv.appendChild(dData);
    descDiv.appendChild(description);

    div.appendChild(titleDiv);
    div.appendChild(descDiv);
    return div;
}

let titleFlag = 'false';
let descFlag = 'false';
let updateBtn = function() {
    let json = [];
    let title = document.getElementById('title').value;
    let desc = document.getElementById('desc').value;
    let data = {"title" : title,"description" : desc};
    jsonRes.push(data);

    let titleDiv = document.getElementById('td');
    let descDiv = document.getElementById('dd');

    let titleLen = titleDiv.children.length;
    let descLen = descDiv.children.length;

    //removing the form from the DOM and replacing with new object
    if(title === '' && desc === '') {
        error.style.display = 'block';
        if(titleLen === 1) {
            titleDiv.appendChild(error);
            titleFlag = 'true';
        }
        if(descLen === 1) {
            descDiv.appendChild(error.cloneNode(true));
            descFlag = 'true';
        }
    }
    else if(title === '' || desc === '') {
        if(title === '') {
            error.style.display = 'block';
            if(titleLen === 1) {
                titleDiv.appendChild(error);
                titleFlag = 'true';
            }
            if(descLen > 2 && descFlag === 'true') {
                descDiv.removeChild(descDiv.lastChild);
                descFlag = 'false';
            }
        }
        else if(desc === '') {
            error.style.display = 'block';
            if(titleLen > 2 && titleFlag === 'true') {
                titleDiv.removeChild(titleDiv.lastChild);
                titleFlag = 'false';
            }
            if(descLen === 1) {
                descDiv.appendChild(error);
                descFlag = 'true';
            }
        }
    }
    else {
        var flag = getUpdateFlag();
        document.getElementById(flag).remove();
        objNum--;
        json.push(data);
        addJson(json); 
    }
};
let cancelFlag;
let setCancelBtn = function(flag) {
    cancelFlag = flag;
}

let getCancelBtn = function() {
    return cancelFlag;
}

let cancelButton = function() {
    let flag = getCancelBtn();
    document.getElementById(flag).remove();
    document.getElementById('add').disabled = false;
}
