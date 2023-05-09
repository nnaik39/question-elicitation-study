var config_deploy = {

    // OBLIGATORY FIELDS

    // the experimentID is needed to recover data from the _babe server app
    // you receive the experimentID when you create the experiment using the _babe server app
    // NOTE: Change the experiment ID to a different 
    "experimentID": "pilot-2-txtversion-study-experiment-final-10minestimate.json",
    "serverAppURL": "https://ig-vqa-default-rtdb.firebaseio.com/",
    // URL

    // set deployment method; use one of:
    //'debug', 'localServer', 'MTurk', 
    // 'MTurkSandbox', 'Prolific', 'directLink'
    "deployMethod": "Prolific",
    // "deployMethod": "directLink",
    // "deployMethod": "MTurk",
    // "deployMethod": "MTurkSandbox",

    // who to contact in case of trouble
    "contact_email": "nanditan@stanford.edu",

    // OPTIONAL FIELDS

    // set the prolific completion URL if the deploy method is "Prolific"
    // the URL should look something like this - https://app.prolific.ac/submissions/complete?cc=ABCD1234
    "prolificURL": "https://app.prolific.co/submissions/complete?cc=CDNRSBTN"
};