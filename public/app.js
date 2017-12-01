// TODO: multiple lists handling

// JQuery selecting DOM elements
var itemTemplate = $('#templates .item');
var list = $('#list');

//initialize https://listalous.herokuapp.com/ api as a constant
// const list_api_url = 'https://listalous.herokuapp.com/lists/';
// const list_api_url = 'https://warm-falls-57027.herokuapp.com/lists/';
const list_api_url = '/lists/';

// initialize list name
// const list_name = 'ew_todo_list';
const list_name = 1;

// FUNCTIONS
//
// function for adding click handlers to list
function clickHandler(del, comp) {
  // click handler for removing item from list
  $(del).on('click', function(){
    // console.log($(this).parent().attr('data-id'));
    deleteFromList($(this).parent().attr('data-id'));
  });

  //click handler for updating item to completed
  $(comp).on('click', function(){
    // console.log($(this).parent().attr('data-id'));
    var buttonParent = $(this).parent();
    updateFromList(buttonParent.attr('data-id'), buttonParent.hasClass('completed'));
  });
}

//function to add list items to the page
function addItemToPage(itemData) {
  // clone new item from itemTemplate;
  var item = itemTemplate.clone();
  // update item with itemData
  item.attr('data-id', itemData.id);
  item.find('.description').text(itemData.description);
  if (itemData.completed) item.addClass('completed');
  // append item to list
  list.append(item);
  // add listeners to list item
  clickHandler(item.find('.delete-button'), item.find('.complete-button'));
}

//function for adding items to list
function addToList(item) {
  $.ajax({
    type: 'POST',
    url: list_api_url + list_name + "/items",
    data: {
      item: {
        description: item,
        completed: false,
      },
    },
    // error callback
    error: function(respnonse, status, error) {
      console.log(status + " " + error);
    },
    // success callback
    success: function(response){
      addItemToPage(response);
    }
  });  //end of ajax function
}

// function for deleting items from list
function deleteFromList(itemID) {
  $.ajax({
    type: 'DELETE',
    url: list_api_url + list_name + "/items/" + itemID,
    // error callback
    error: function(respnonse, status, error) {
      console.log(status + " " + error);
    },
    // success callback
    success: function(response){
      // remove the list item from DOM
      $(`.item[data-id=${response.id}]`).remove();
      // console.log(response);
    }
  });  //end of ajax function
}

// function for updating items from list to completed
function updateFromList(itemID, completed) {
  // check if item is already completed
  $.ajax({
    type: 'PUT',
    url: list_api_url + list_name + "/items/" + itemID,
    data: {
      //if completed = true, list item was already completed, update item.completed to false
      //and vice versa
      item: {
        completed: !completed,
      },
    },
    // error callback
    error: function(respnonse, status, error) {
      console.log(status + " " + error);
    },
    // success callback
    success: function(response){
      // check 'completed' argument and update the list item from DOM accordingly
      if (completed) {
        $(`.item[data-id=${response.id}]`).removeClass('completed');
      } else {
        $(`.item[data-id=${response.id}]`).addClass('completed');
      }
      // console.log(response);
    }
  });  //end of ajax function
}



//function for list api GET request
function getList() {
  $.ajax({
    type: 'GET',
    url: list_api_url + list_name + "/items/",
    // error callback
    error: function(respnonse, status, error) {
      console.log(status + " " + error);
    },
    // success callback
    success: function(response){
      // console.log(response);
      response.forEach(item => {
        addItemToPage(item);
      });
    }
  });  //end of ajax function
}

// input box handling on submitting new list items
$('#add-form').submit(function() {
  addToList($('#create').val());
  $('#create').val('');
  return false;
});

// get list on page load by calling getList() function
getList();
