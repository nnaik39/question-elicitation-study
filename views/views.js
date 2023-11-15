var botcaptcha = {
    name: "botcaptcha",
    title: "Are you a bot?",
    buttonText: "Next",
    render: function(){
        var viewTemplate = $("#botcaptcha-view").html();

        // define possible speaker and listener names
        // fun fact: 10 most popular names for boys and girls
        var speaker = _.shuffle(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"])[0];
        var listener = _.shuffle(["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Margaret"])[0];

        var story = speaker + ' says to ' + listener + ': "It\'s a beautiful day, isn\'t it?"'

        $("#main").html(
            Mustache.render(viewTemplate, {
                name: this.name,
                title: this.title,
                text: story,
                question: "Who is " + speaker + " talking to?",
                button: this.buttonText
            })
        );

        // don't allow enter press in text field
        $('#listener-response').keypress(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
            }
        });

        // don't show any error message
        $("#error").hide();
        $("#error_incorrect").hide();
        $("#error_2more").hide();
        $("#error_1more").hide();

        // amount of trials to enter correct response
        var trial = 0;

        $("#next").on("click", function() {
            response = $("#listener-response").val().replace(" ","");

            // response correct
            if (listener.toLowerCase() == response.toLowerCase()) {
                exp.global_data.botresponse = $("#listener-response").val();
                exp.findNextView();

            // response false
            } else {
                trial = trial + 1;
                $("#error_incorrect").show();
                if (trial == 1) {
                    $("#error_2more").show();
                } else if (trial == 2) {
                    $("#error_2more").hide();
                    $("#error_1more").show();
                } else {
                    $("#error_incorrect").hide();
                    $("#error_1more").hide();
                    $("#next").hide();
                    $('#quest-response').css("opacity", "0.2");
                    $('#listener-response').prop("disabled", true);
                    $("#error").show();
                };
            };
            
        });

    },
    trials: 1
};

var intro = {
    name: "intro",
    // introduction title
    title: "Stanford NLP Lab",
    // introduction text
    text:
        "Thank you for participating in our study. In this study, you will see six AI-generated descriptions paired with a type of website where the image appears. For each image description, you will write questions to understand the image further. The whole study should take about seven and a half minutes. Please only participate once in this study. <br>Please do <strong>not</strong> participate on a mobile device since the page won't display properly.<br><small>If you have any questions or concerns, don't hesitate to contact me at nanditan@stanford.edu</small>",
    legal_info:
        "<strong>LEGAL INFORMATION</strong>:<br><br>We invite you to participate in a research study on language production and comprehension.<br>Your experimenter will ask you to do a linguistic task such as reading sentences or words, naming pictures or describing scenes, making up sentences of your own, or participating in a simple language game.<br><br>You will be paid for your participation at the posted rate.<br><br>There are no risks or benefits of any kind involved in this study.<br><br>If you have read this form and have decided to participate in this experiment, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at any time without penalty or loss of benefits to which you are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be maintained in all published and written data resulting from the study.<br>You may print this form for your records.<br><br>CONTACT INFORMATION:<br>If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, you should contact the Protocol Director Christopher Potts at (650) 723-4284. <br>If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>If you agree to participate, please proceed to the study tasks.",
    // introduction's slide proceeding button text
    buttonText: "Next",
    // render function renders the view
    render: function() {
        var viewTemplate = $("#intro-view").html();

        $("#main").html(
            Mustache.render(viewTemplate, {
                picture: "images/stanford_nlp_group.jpeg",
                title: this.title,
                text: this.text,
                legal_info: this.legal_info,
                button: this.buttonText
            })
        );

        var prolificId = $("#prolific-id");
        var IDform = $("#prolific-id-form");
        var next = $("#next");

        var showNextBtn = function() {
            if (prolificId.val().trim() !== "") {
                next.removeClass("nodisplay");
            } else {
                next.addClass("nodisplay");
            }
        };

        if (config_deploy.deployMethod !== "Prolific") {
            IDform.addClass("nodisplay");
            next.removeClass("nodisplay");
        }

        prolificId.on("keyup", function() {
            showNextBtn();
        });

        prolificId.on("focus", function() {
            showNextBtn();
        });

        // moves to the next view
        next.on("click", function() {
            if (config_deploy.deployMethod === "Prolific") {
                exp.global_data.prolific_id = prolificId.val().trim();
            }

            exp.findNextView();
        });
    },
    // for how many trials should this view be repeated?
    trials: 1
};

var instruction_screen = {
    name: "instruction",
    title: "Instructions",
    text:
        "<strong>Online images</strong> can be a useful resource, but there are cases where you <strong>cannot directly see</strong> the image—for instance, if you have a visual impairment or if you’re browsing a speech-enabled website where the site content is narrated.",
    paragraph2: "In this study, we’re investigating how asking questions might help when you can’t see the image. You’ll see six <strong>image descriptions</strong>, each paired with a type of website where you might see the image. You’ll be asked to <strong> guess why </strong> the image appears on this type of website, and to <strong> ask questions </strong> to understand the image further.",
    readyText: "Are you ready?",
    buttonText: "Begin experiment",
    // render function renders the view
    render: function() {
        var viewTemplate = $("#instruction-screen-view").html();

        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                picture: 'images/question_elicitation_study.gif',
                text: this.text,
                button: this.buttonText,
                paragraph2: this.paragraph2,
                readyText: this.readyText
            })
        );

        var start = $("#start");

        // moves to the next view
        start.on("click", function() {
            exp.findNextView();
        });
    },
    // for how many trials should this view be repeated?
    trials: 1
};

var main = {
    name: "main",
    render: function(CT) {
        // fill variables in view-template
        var viewTemplate = $("#main-view").html();

//        console.log("Main trials ", exp.trial_info.main_trials)

//        console.log("Current trial ", exp.trial_info.main_trials[CT])
  //      console.log("CT index ", CT)

    //    console.log("Picture name ", exp.trial_info.main_trials[CT]['filename'])
      //  console.log("Current category ", exp.trial_info.main_trials[CT]['category'])

        q1 = "How likely is it that you come across this image while browsing a "
        q2 = "What are two questions that you'd want to have answered by someone who can see the image if you encountered it on a "

        q2 = "If you encountered this image on a "
        if (exp.trial_info.main_trials[CT]['category'] == 'health') {
            text = "Imagine that you are browsing a <strong>health website</strong>, with the goal of learning how to live a healthier lifestyle, when you encounter the following image."
            q1 += "<strong>health website</strong>"
            q2 += "<strong>health website</strong>"
        }
        else if (exp.trial_info.main_trials[CT]['category'] == 'shopping') {
            text = "Imagine that you are browsing a <strong>shopping website</strong>, with the goal of purchasing an item or experience, when you encounter the following image."
            q1 += "<strong>shopping website</strong>"
            q2 += "<strong>shopping website</strong>"
        }
        else if (exp.trial_info.main_trials[CT]['category'] == 'social_media') {
            text = "Imagine that you are browsing a <strong>social media website</strong>, with the goal of learning more about your connections, when you encounter the following image."
            q1 += "<strong>social media website</strong>"
            q2 += "<strong>social media website</strong>"
        }
        else if (exp.trial_info.main_trials[CT]['category'] == 'news') {
            text = "Imagine that you are browsing a <strong>news website</strong> (such as the New York Times), with the goal of learning more about recent news developments, when you encounter the following image."
            q1 += "<strong>news website</strong>"
            q2 += "<strong>news website</strong>"
        }
        else if (exp.trial_info.main_trials[CT]['category'] == 'travel') {
            text = "Imagine that you are browsing a <strong>travel website</strong>, with the goal of traveling to a new location, when you encounter the following image."
            q1 += "<strong>travel website</strong>"
            q2 += "<strong>travel website</strong>"
        }
        else if (exp.trial_info.main_trials[CT]['category'] == 'science_journals') {
            text = "Imagine that you are browsing a <strong>science magazine website</strong> (such as National Geographic), with the goal of learning more about recent science developments, when you encounter the following image."
            q1 += "<strong>science magazine website</strong>"
            q2 += "<strong>science magazine website</strong>"
        }

        q1 += "?"

        q2 += ", what are two questions that you'd want to have answered by someone who can see the image?"
        checkbox = 'There is a grammatical error in the description';

        slider_left = 'Not likely';
        slider_right = 'Likely';

        console.log("Checkbox default ", $('checkbox').val())

        $("#main").html(
            Mustache.render(viewTemplate, {
                critical_text: text,
                picture: exp.trial_info.main_trials[CT]['filename'],
                description: exp.trial_info.main_trials[CT]['description'],
                slider_left: slider_left,
                slider_right: slider_right,
                q1: q1,
                q2: q2,
                q3: exp.trial_info.q3,
                q4: exp.trial_info.q4,
                q5: exp.trial_info.q5,
                q6: exp.trial_info.q6,
                checkbox: checkbox
            })
        );

        window.scrollTo(0,0);

        var context_justification = $('#context-justification');
        var context_justification_changed = false;

        // If the context justification has been set, then allow them to move to the next version
        context_justification.on('click', function() {
            context_justification_changed = true;

            $("#error").css({"visibility": "hidden"});
        });

        var question1 = $('#question-1');
        var question1_changed = false;

        question1.on('keyup', function() {
            value = question1.val();
            if (value.length >= 10) question1_changed = true;
            else if (value.length < 10) question1_changed = false;

            $("#error").css({"visibility": "hidden"});
        });

        var question2 = $('#question-2');
        var question2_changed = false;

        question2.on('keyup', function() {
            value = question2.val();
            if (value.length >= 10) question2_changed = true;
            // Detect deletions
            else if (value.length < 10) question2_changed = false;
            $("#error").css({"visibility": "hidden"});
        });

        question1.on('paste', function(e) {
            e.preventDefault();
            return false;
        });

        question2.on('paste', function(e) {
            e.preventDefault();
            return false;
        });

        var box_checked = false;

        $('input[id=checkbox]').change(function(){
            console.log("checkbox on change is checked");
            console.log("Box checked value ", box_checked)
            if($(this).is(':checked')) {
                box_checked = true;
            } else {
                box_checked = false;
            }
            console.log("Box checked value after changing/updating it ", box_checked)
        });

        // event listener for buttons; when an input is selected, the response
        // and additional information are stored in exp.trial_info
        $("#hint").on("click", function() {
            var popup = document.getElementById("myPopup");
            popup.classList.toggle("show");
        });

        $("#next").on("click", function() {
            console.log("checkbox value ", box_checked)

            if (context_justification_changed & question1_changed & question2_changed) {
                var RT = Date.now() - startingTime; // measure RT before anything else
                var trial_data = {
                    trial_number: CT + 1,
                    reactionTime: RT,
                    picture: exp.trial_info.main_trials[CT]['filename'],
                    description: exp.trial_info.main_trials[CT]['description'],
                    category: exp.trial_info.main_trials[CT]['category'],
                    context_justification: $('#context-justification').val(),
                    q1: $('#question-1').val(),
                    q2: $('#question-2').val(),
                    checkbox: box_checked,
                    comments: $('#comments').val()
                };
//                console.log('Trial data ', trial_data)

                exp.trial_data.push(trial_data);
                exp.findNextView();
            } else {
                console.log($("#error"));    
                $("#error").css({"visibility": "visible"});
            };
        });

        // record trial starting time
        var startingTime = Date.now();
    },
    trials: 6
};

var postTest = {
    name: "postTest",
    title: "Additional Info",
    text:
        "Answering the following questions is optional, but will help us understand your answers.",
    buttonText: "Continue",
    render: function() {
        var viewTemplate = $("#post-test-view").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                buttonText: this.buttonText
            })
        );

        $("#next").on("click", function(e) {
            // prevents the form from submitting
            e.preventDefault();

            // records the post test info
            exp.global_data.HitCorrect = $("#HitCorrect").val();
            exp.global_data.languages = $("#languages").val();
            exp.global_data.enjoyment = $("#enjoyment").val();
            exp.global_data.comments = $("#comments")
                .val()
                .trim();
            exp.global_data.endTime = Date.now();
            exp.global_data.timeSpent =
                (exp.global_data.endTime - exp.global_data.startTime) / 60000;

            // moves to the next view
            exp.findNextView();
        });
    },
    trials: 1
};

var thanks = {
    name: "thanks",
    message: "Thank you for taking part in this experiment!",
    render: function() {
        var viewTemplate = $("#thanks-view").html();

        // what is seen on the screen depends on the used deploy method
        //    normally, you do not need to modify this
        if (
            config_deploy.is_MTurk ||
            config_deploy.deployMethod === "directLink"
        ) {
            // updates the fields in the hidden form with info for the MTurk's server
            $("#main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message
                })
            );
        } else if (config_deploy.deployMethod === "Prolific") {
            $("main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message,
                    extraMessage:
                        "Please press the button below to confirm that you completed the experiment with Prolific. Your completion code is CSAI0DIS. <br />" +
                        "<a href=" +
                        config_deploy.prolificURL +
                        ' class="prolific-url">Confirm</a>'
                })
            );
        } else if (config_deploy.deployMethod === "debug") {
            $("main").html(Mustache.render(viewTemplate, {}));
        } else {
            console.log("no such config_deploy.deployMethod");
        }

        exp.submit();
    },
    trials: 1
};
