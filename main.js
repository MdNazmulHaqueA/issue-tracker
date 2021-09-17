document
   .getElementById('issueInputForm')
   .addEventListener('submit', submitIssue);

function submitIssue(e) {
   const getInputValue = id => document.getElementById(id).value;
   //getting input values
   const description = getInputValue('issueDescription');
   const severity = getInputValue('issueSeverity');
   const assignedTo = getInputValue('issueAssignedTo');

   //fix 1: description, assigned to empty but adding to issues
   if (description && assignedTo) {
      const id = Math.floor(Math.random() * 100000000) + '';
      const status = 'Open';

      const issue = { id, description, severity, assignedTo, status };
      let issues = [];

      if (localStorage.getItem('issues')) {
         issues = JSON.parse(localStorage.getItem('issues'));
      }

      issues.push(issue);
      localStorage.setItem('issues', JSON.stringify(issues));

      document.getElementById('issueInputForm').reset();
      fetchIssues();
      e.preventDefault();
   } else {
      alert('Either description or assigned to or or both fields are empty');
   }
}
//fix 2:close button was not working - 1. function name was wrong, 2. checking equality with different type
const setStatusClosed = id => {
   const issues = JSON.parse(localStorage.getItem('issues'));
   // const currentIssue = issues.find(issue => issue.id === id); => undefined
   const currentIssue = issues.find(issue => Number(issue.id) === id);

   currentIssue.status = 'Closed';
   localStorage.setItem('issues', JSON.stringify(issues));
   fetchIssues();
};

//Fix 3 : Delete button was not working - 1. problem with type 2. not calling the fetchIssues after deleting
const deleteIssue = id => {
   const issues = JSON.parse(localStorage.getItem('issues'));
   const remainingIssues = issues.filter(issue => Number(issue.id) !== id);
   //  const remainingIssues = issues.filter(issue.id !== id);
   localStorage.setItem('issues', JSON.stringify(remainingIssues));
   //fetchIssues missing
   fetchIssues();
};

const fetchIssues = () => {
   const issues = JSON.parse(localStorage.getItem('issues'));
   let countClosedIssue = 0;
   const issuesList = document.getElementById('issuesList');
   issuesList.innerHTML = '';

   for (var i = 0; i < issues.length; i++) {
      const { id, description, severity, assignedTo, status } = issues[i];
      if (status === 'Closed') {
         countClosedIssue += 1;
      }
      issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label ${
                                 status === 'Closed'
                                    ? 'label-success'
                                    : 'label-info'
                              }"> ${status} </span></p>
                              <h3 style="text-decoration:${
                                 status === 'Closed' ? 'line-through' : ''
                              }">${description}</h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="setStatusClosed(${id})" class="btn btn-warning">Close</a>
                              <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                              </div>`;
   }

   // issue counter
   let totalIssue = issues.length;
   document.getElementById('issue-counter').innerText = totalIssue;
   //issueLeft
   document.getElementById('issue-left').innerText =
      totalIssue - countClosedIssue;
};
