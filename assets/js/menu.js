function showMobileMenu() {

    var x = document.getElementById("dropdown-menu");
    if (x.className === "nav-menu-wrapper") {
        x.className = "mobile-menu-wrapper";
    }
    else {
        x.className = "nav-menu-wrapper";
    }
}

function showMobileSearch() {

    var x = document.getElementById("mobile-search");
    if (x.className === "hidden") {
        x.className = "mobile-search-box";
    }
    else {
        x.className = "hidden";
    }
}

function showCategoryTitles(clicked_id) {

    var x = document.getElementById(clicked_id);

    var y = x.nextElementSibling;

    if (y.className === "sub-menu") {
        y.className = "mobile-sub-menu";
    }
    else {
        y.className = "sub-menu";
    }

}

function showCategories(clicked_id) {


    var x = document.getElementById(clicked_id);

    var y = x.nextElementSibling;

    if (y.className === "category-list") {
        y.className = "mobile-category-list";
    }
    else {
        y.className = "category-list";
    }
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        var data_object = myObj.data.results;

        var initial_array = Object.keys(data_object).map(function(key) {
            return [Number(key), data_object[key]];
        });

        var data_array = [];
        for (i = 0; i < initial_array.length; i++) {
            current_object = initial_array[i];
            var current_array = Object.keys(current_object).map(function(key) {
                return [Number(key), current_object[key]];
            });

            data_array.push(current_array);
        }
        autocomplete(document.getElementById("myInput"), data_array);
    }
};


xmlhttp.open("GET", "data.json", true);
xmlhttp.send();



function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (val.length > 2) {

                if (arr[i][1][1]["value"].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    var image = arr[i][1][1]["image"];

                    image = image.replace(/\\/g, "");

                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<p><button class='basket'>Basket</button><button class='quote'>Quote</button><img src=" + image + ">" + arr[i][1][1]["value"] + "<span><br>Brand: " + arr[i][1][1]['brand'] + " | Weight: " + arr[i][1][1]['weight'] + " kg</span></p>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        }
        else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        }
        else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}