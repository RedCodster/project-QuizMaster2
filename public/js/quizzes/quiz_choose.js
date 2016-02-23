$(document).ready (function() {

  function createQuestion (e) {
    e.preventDefault();

    var newAsk = $('input.question').val();
    var newAnswer = $('input.answer').val();
    var newDummy1 = $('input.dummy1').val();
    var newDummy2 = $('input.dummy2').val();
    var newUrl = $('input.url').val();

    if (newAsk == '' || newAnswer == '' || newDummy1 == '' || newDummy2 == '') {
      alert('All fields except "url" must be populated to make valid question.');
      return;
    }


    var newQuestion = ''+
      '<li>' +
        '<label>Question</label><input name="question" type="text" value="' + newAsk + '"></br>' +
        '<label>Answer</label><input name="answer" type="text" value="' + newAnswer + '"></br>' +
        '<label>Dummy1</label><input name="dummy1" type="text" value="' + newDummy1 + '"></br>' +
        '<label>Dummy2</label><input name="dummy2" type="text" value="' + newDummy2 + '"></br>' +
        '<label>Url</label><input name="url" type="text" value="' + newUrl + '">' +
        '<button class="delete-btn btn btn-danger">Delete</button>' +
      '</li>';

    this.reset();
    $('#question-list').prepend(newQuestion);

    $('.delete-btn').on('click', function () {
      $(this).parent().remove();
    });
  }

  $('#question-form').on('submit', createQuestion);

  function createQuiz (e) {
    e.preventDefault();

    var questionSet = [];
    var quizName = $('input.quiz-name').val();
    var quizTopic = $('input.quiz-topic').val();

    if (quizName == '' || quizTopic == '') {
      alert('Quiz must have a name and topic to be valid.');
      return;
    }

    $('#question-list li').each(function (index, li) {
      //put each item into an object and append to questionSet array
      var question = {
        'question':($(li).find('input:eq(0)').val()),
        'answer':($(li).find('input:eq(1)').val()),
        'dummy1':($(li).find('input:eq(2)').val()),
        'dummy2':($(li).find('input:eq(3)').val()),
        'url':($(li).find('input:eq(4)').val())
      }
      questionSet.push(question);
    });

    var newQuiz = {
      quizName: quizName,
      quizTopic: quizTopic,
      questionSet:questionSet,
      quizLength: questionSet.length
    };
    console.log(newQuiz);

    $.ajax({
        url: "http://0.0.0.0:8000/api/quizzes",
        method: "POST",
        data: newQuiz,
        success: function (response, status) {
          console.log(response);
        },
        error: function (response, status) {
          console.log(response);
        }
      });
  }

  $('#create-quiz').on('click', createQuiz);


});