// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase app settings
const appSettings = {
    databaseURL: "https://realtime-database-df319-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// DOM elements
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// Add event listener to the "Add" button
addButtonEl.addEventListener("click", function() {
    // Get input value
    let inputValue = inputFieldEl.value;
    
    // Push input value to Firebase database
    push(shoppingListInDB, inputValue);
    
    // Clear input field
    clearInputFieldEl();
});

// Listen for changes in the shopping list in the database
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        // Convert snapshot to array
        let itemsArray = Object.entries(snapshot.val());
    
        // Clear shopping list
        clearShoppingListEl();
        
        // Iterate through items array and append them to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendItemToShoppingListEl(currentItem);
        }    
    } else {
        // Display message if no items in the shopping list
        shoppingListEl.innerHTML = "No items here... yet";
    }
});

// Function to clear the shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

// Function to clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = "";
}

// Function to append item to the shopping list
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    
    newEl.textContent = itemValue;
    
    // Add event listener to remove item when clicked
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        
        remove(exactLocationOfItemInDB);
    });
    
    // Append new item to the shopping list
    shoppingListEl.append(newEl);
}