const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
      
      sendAjax('GET', '/getToken', null, (result) => {
        ReactDOM.render(
          <DomoList domos={data.domos} csrf={result.csrfToken} />, document.querySelector("#domos")
        );                
      });
  });
};

const handleDomo = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'},350);
  
  if($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR!  All fields are required");
    return false;
  }
  
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer();
  });
  
  return false;
};

const handleDelete = (e) => {
  e.preventDefault();
  
  sendAjax('POST', '/removeDomo', $(e.target).serialize(), function() {
    loadDomosFromServer();
  });
  
  return false;
};

const DomoForm = (props) => {
  return (
    <form id="domoForm"
          onSubmit={handleDomo}
          name="domoForm"
          action="/maker"
          method="POST"
          className="domoForm"
    >
          <label htmlFor="name">Name: </label>
          <input id="domoName" type="text" name="name" placeholder="Domo Name" />
          <label htmlFor="age">Age: </label>
          <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
          <label htmlFor="color">Color: </label>
          <input id="domoColor" type="text" name="color" placeholder="Domo Color" />
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const DomoList = function(props) {
  
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map(function(domo) {
    
    var styles = {
      backgroundColor: domo.color,
    };
    
    return (
      <div key={domo._id} className="domo" style={styles}>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {domo.name} </h3>
        <h3 className="domoAge"> Age: {domo.age} </h3>
        <form className="deleteDomo"
              onSubmit={handleDelete}
              name="deleteForm"
              action="/removeDomo"
              method="POST"
        >
              <input type="hidden" name="_csrf" value={props.csrf} />
              <input type="hidden" name="name" value={domo.name} />
              <input className="removeDomoSubmit" type="submit" value="Delete This Domo" />
        </form>    
      </div>
    );
  });
  
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
  
  ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
  );
  
  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
    