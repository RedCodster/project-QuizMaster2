$(document).ready (function() {
  var $selectedQuiz = null;

  function createQuestion (e) {
    e.preventDefault();

    var newAsk = $('#make input.question').val();
    var newAnswer = $('#make input.answer').val();
    var newDummy1 = $('#make input.dummy1').val();
    var newDummy2 = $('#make input.dummy2').val();
    var newUrl = $('#make input.url').val();

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
    $('#make #question-list').prepend(newQuestion);

    $('#make .delete-btn').on('click', function () {
      $(this).parent().remove();
    });
  }

  $('#make #question-form').on('submit', createQuestion);

  function createQuiz (e) {
    e.preventDefault();

    var questionSet = [];
    var quizName = $('#make input.quiz-name').val();
    var quizTopic = $('#make input.quiz-topic').val();

    if (quizName == '' || quizTopic == '') {
      alert('Quiz must have a name and topic to be valid.');
      return;
    }

    $('#make #question-list li').each(function (index, li) {
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
      url: "/api/quizzes",
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

  $('#make #create-quiz').on('click', createQuiz);

  function deleteQuiz (e) {
    e.preventDefault();
    var $button = $(this);
    var id = $button.data('id');

    $.ajax({
      url: '/api/quizzes/' + id,
      method: 'DELETE',
      success: function (response, status) {
        console.log(response);
        $button.parent().remove();
      },
      error: function (response, status) {
        console.log(response);
      }
    });
  }

  $('#edit .delete').on("click", deleteQuiz);

  function createEditQuestion (e) {
    e.preventDefault();

    var newAsk = $('#edit input.question').val();
    var newAnswer = $('#edit input.answer').val();
    var newDummy1 = $('#edit input.dummy1').val();
    var newDummy2 = $('#edit input.dummy2').val();
    var newUrl = $('#edit input.url').val();

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
    $('#edit #question-edit-list').prepend(newQuestion);

    $('.delete-btn').on('click', function () {
      $(this).parent().remove();
    });
  }

  $('#edit #question-edit-form').on('submit', createEditQuestion);

  function updateQuiz (e) {
    e.preventDefault();

    var questionSet = [];
    var quizName = $('#edit input.quiz-name').val();
    var quizTopic = $('#edit input.quiz-topic').val();
    var id = $('#edit #update-quiz').data('id');

    if (quizName == '' || quizTopic == '') {
      alert('Quiz must have a name and topic to be valid.');
      return;
    }

    $('#edit #question-edit-list li').each(function (index, li) {
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
      url: "/api/quizzes/" + id,
      method: "PUT",
      data: newQuiz,
      success: function (response, status) {
        console.log(response);
        $selectedQuiz.find("a").text(quizName);
        $selectedQuiz.find(".edit").data("name", quizName);
        $selectedQuiz.find(".edit").data("topic", quizTopic);

        $('#edit-list').show();
        $('#edit-quiz').hide();
      },
      error: function (response, status) {
        console.log(response);
      }
    });
  }

  $('#edit #update-quiz').on('click', updateQuiz);

  // Function to list questions from existing quiz
  function getQuestions (e) {
    e.preventDefault();

    $selectedQuiz = $(this).parent();
    var name = $(this).data('name');
    var topic = $(this).data('topic');
    var id  = $(this).data('id');

    $('#edit .quiz-name').val(name);
    $('#edit .quiz-topic').val(topic);
    $('#edit #update-quiz').data("id", id);

    var quiz_id = $(this).parent().find('a').data('id');
    $.ajax({
      method: "GET",
      url: '/api/quizzes/' + quiz_id + '/questions',
      success: function (response) {
        console.log(response);
        var questionSet = response;
        var count = questionSet.length;

        $('#edit #question-edit-list').empty();
        for (i=0; i < count; i++) {
          var list = questionSet[i];
          var editQuestion = ''+
            '<li>' +
              '<label>Question</label><input name="question" type="text" value="' + list.question + '"></br>' +
              '<label>Answer</label><input name="answer" type="text" value="' + list.answer + '"></br>' +
              '<label>Dummy1</label><input name="dummy1" type="text" value="' + list.dummy1 + '"></br>' +
              '<label>Dummy2</label><input name="dummy2" type="text" value="' + list.dummy2 + '"></br>' +
              '<label>Url</label><input name="url" type="text" value="' + list.url + '">' +
              '<button class="delete-btn btn btn-danger">Delete</button>' +
            '</li>';

          $('#question-edit-list').prepend(editQuestion);
        }

        $('#edit-list').hide();
        $('#edit-quiz').show();

        $('.delete-btn').on('click', function () {
          $(this).parent().remove();
        });
      }
    });
  }
  $('#edit-list .edit').on("click", getQuestions);
});
