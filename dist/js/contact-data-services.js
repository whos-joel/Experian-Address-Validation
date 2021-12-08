/*! contact-data-services.js | https://github.com/experianplc/Experian-Address-Validation | Apache-2.0
*   Experian | https://github.com/experianplc */

;(function(window, document, undefined) {

    "use strict";

// Create ContactDataServices constructor and namespace on the window object (if not already present)
var ContactDataServices = window.ContactDataServices = window.ContactDataServices || {};

// Default settings
ContactDataServices.defaults = {
	input: { placeholderText: "Start typing an address...", applyFocus: false },
	formattedAddressContainer: { showHeading: false, headingType: "h3", validatedHeadingText: "Validated address", manualHeadingText: "Manual address entered"  },
	searchAgain: { visible: true, text: "Search again"},
	manualEntry: { visible: true, text: "<a class='btn btn-secondary'>Enter address manually</a>"},
	infoAlert: { 
		visible: true, 
		text: "More results are available", 
		popoverBtn: {
			visible: true, 
			title: "",
			text: "",
			icon: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-info-circle-fill' viewBox='0 0 16 16'> <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'/> </svg>"
		}
	},
	useSpinner: false,
	language: "en",
	addressLineLabels: [
		"address_line_1",
		"address_line_2",
		"address_line_3",
		"locality",
		"region",
		"postal_code",
		"country"
	]
};

// Create configuration by merging custom and default options
ContactDataServices.mergeDefaultOptions = function(customOptions){
	var instance = customOptions || {};

	instance.enabled = true;
	instance.language = instance.language || ContactDataServices.defaults.language;
	instance.useSpinner = instance.useSpinner || ContactDataServices.defaults.useSpinner;
	instance.lastSearchTerm = "";
	instance.currentSearchTerm = "";
	instance.lastCountryCode = "";
	instance.currentCountryCode = "";
	instance.currentSearchUrl = "";
	instance.currentFormatUrl = "";
	instance.applyFocus = (typeof instance.applyFocus !== "undefined") ? instance.applyFocus : ContactDataServices.defaults.input.applyFocus;
	instance.placeholderText = instance.placeholderText || ContactDataServices.defaults.input.placeholderText;
	instance.searchAgain = instance.searchAgain || {};
	instance.searchAgain.visible = (typeof instance.searchAgain.visible !== "undefined") ? instance.searchAgain.visible : ContactDataServices.defaults.searchAgain.visible;
	instance.searchAgain.text = instance.searchAgain.text || ContactDataServices.defaults.searchAgain.text;
	instance.formattedAddressContainer = instance.formattedAddressContainer || ContactDataServices.defaults.formattedAddressContainer;
	instance.formattedAddressContainer.showHeading = (typeof instance.formattedAddressContainer.showHeading !== "undefined") ? instance.formattedAddressContainer.showHeading : ContactDataServices.defaults.formattedAddressContainer.showHeading;
	instance.formattedAddressContainer.headingType = instance.formattedAddressContainer.headingType || ContactDataServices.defaults.formattedAddressContainer.headingType;
	instance.formattedAddressContainer.validatedHeadingText = instance.formattedAddressContainer.validatedHeadingText || ContactDataServices.defaults.formattedAddressContainer.validatedHeadingText;
	instance.formattedAddressContainer.manualHeadingText = instance.formattedAddressContainer.manualHeadingText || ContactDataServices.defaults.formattedAddressContainer.manualHeadingText;
	instance.elements = instance.elements || {};
	instance.manualEntry = instance.manualEntry || {};
	instance.manualEntry.visible = (typeof instance.manualEntry.visible !== "undefined") ? instance.manualEntry.visible : ContactDataServices.defaults.manualEntry.visible;
	instance.manualEntry.text = instance.manualEntry.text || ContactDataServices.defaults.manualEntry.text;
	instance.infoAlert = instance.infoAlert || {};
	instance.infoAlert.visible = (typeof instance.infoAlert.visible !== "undefined") ? instance.infoAlert.visible : ContactDataServices.defaults.infoAlert.visible;
	instance.infoAlert.text = (typeof instance.infoAlert.text !== "undefined") ? instance.infoAlert.text : ContactDataServices.defaults.infoAlert.text;
	instance.infoAlert.popoverBtn = instance.infoAlert.popoverBtn || {};
	instance.infoAlert.popoverBtn.visible = (typeof instance.infoAlert.popoverBtn.visible !== "undefined") ? instance.infoAlert.popoverBtn.visible : ContactDataServices.defaults.infoAlert.popoverBtn.visible;
	instance.infoAlert.popoverBtn.text = (typeof instance.infoAlert.popoverBtn.text !== "undefined") ? instance.infoAlert.popoverBtn.text : ContactDataServices.defaults.infoAlert.popoverBtn.text;
	instance.infoAlert.popoverBtn.title = (typeof instance.infoAlert.popoverBtn.title !== "undefined") ? instance.infoAlert.popoverBtn.title : ContactDataServices.defaults.infoAlert.popoverBtn.title;
	instance.infoAlert.popoverBtn.icon = (typeof instance.infoAlert.popoverBtn.icon !== "undefined") ? instance.infoAlert.popoverBtn.icon : ContactDataServices.defaults.infoAlert.popoverBtn.icon;
	return instance;
};

// Constructor method event listener (pub/sub type thing)
ContactDataServices.eventFactory = function(){
	// Create the events object
	var events = {};

	// Create an object to hold the collection of events
	events.collection = {};

	// Subscribe a new event
	events.on = function (event, action) {
        // Create the property array on the collection object
        events.collection[event] = events.collection[event] || [];
        // Push a new action for this event onto the array
        events.collection[event].push(action);
    };

    // Publish (trigger) an event
	events.trigger = function (event, data) {
        // If this event is in our collection (i.e. anyone's subscribed)
        if (events.collection[event]) {
            // Loop over all the actions for this event
            for (var i = 0; i < events.collection[event].length; i++) {
                // Create array with default data as 1st item
                var args = [data];

                // Loop over additional args and add to array
                for (var a = 2; a < arguments.length; a++){
                    args.push(arguments[a]);
                }

                // Call each action for this event type, passing the args
				try {
					events.collection[event][i].apply(events.collection, args);
				} catch (e) {
					// What to do? Uncomment the below to show errors in your event actions
					//console.error(e);
				}
            }
        }
    };

    // Return the new events object to be used by whoever invokes this factory
    return events;
};

// Translations
ContactDataServices.translations = {
// language / country / property
  en: {
    gbr: {
      locality: "Town/City",
      region: "County",
      postal_code: "Post code"
    },
    usa: {
      locality: "City",
      region: "State",
      postal_code: "Zip code"
    }
  }
  // Add other languages below
};

// Method to handle showing of UA (User Assistance) content
ContactDataServices.ua = {
	banner: {
        show: function(html){
            // Retrieve the existing banner
            var banner = document.querySelector(".ua-banner");
            
            // Create a new banner if necessary
            if(!banner){
                var firstChildElement = document.querySelector("body").firstChild;
                banner = document.createElement("div");
                banner.classList.add("ua-banner");            
                firstChildElement.parentNode.insertBefore(banner, firstChildElement.nextSibling);
            }

            // Apply the HTML content
            banner.innerHTML = html;
        },
        hide: function(){
            var banner = document.querySelector(".ua-banner");
            if(banner) {
                banner.parentNode.removeChild(banner);
            }
        }
    }
};

// Generate the URLs for the various requests
ContactDataServices.urls = {
  endpoint: "https://api.experianaperture.io/address/search/v1",
  construct: {
    address: {
      // Construct the Search URL
      searchUrl: function(){
        return ContactDataServices.urls.endpoint;
      },
      searchData: function(instance){
        var data = {
          country_iso: instance.currentCountryCode,
          components: {unspecified: [instance.currentSearchTerm]},
          dataset: instance.currentDataSet,
          max_suggestions: (instance.maxSize || instance.picklist.maxSize)
        };

        if (instance.elements.location) {
          data.location = instance.elements.location;
        }
        return JSON.stringify(data);
      }
    }
  },
  // Get token from query string and set on instance
  getToken: function(instance){
    if(!instance.token) {
      instance.token = ContactDataServices.urls.getParameter("token");
    }
  },
  getParameter: function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
};
// Integrate with address searching
ContactDataServices.address = function (customOptions) {
  // Build our new instance by merging custom and default options
  var instance = ContactDataServices.mergeDefaultOptions(customOptions);

  // Create a new object to hold the events from the event factory
  instance.events = new ContactDataServices.eventFactory();

  // Initialise this instance
  instance.init = function () {
    // Get token from the query string
    ContactDataServices.urls.getToken(instance);
    if (!instance.token) {
      // Disable searching on this instance
      instance.enabled = false;
      // Display a banner informing the user that they need a token
      ContactDataServices.ua.banner.show("<a href='https://github.com/experianplc/Experian-Address-Validation#tokens'>Please provide a token for Experian Address Validation.</a>");
      return;
    }

    instance.hasSearchInputBeenReset = true;
    instance.setCountryList();

    if (instance.elements.input) {
      instance.input = instance.elements.input;
      instance.countryCodeMapping = instance.elements.countryCodeMapping || {};

      // Bind an event listener on the input
      instance.input.addEventListener("keyup", instance.search);
      instance.input.addEventListener("keydown", instance.checkTab);
      instance.input.addEventListener("click", function (event) {
        event.stopPropagation();
      });
      // Set a placeholder for the input
      instance.input.setAttribute("placeholder", instance.placeholderText);
      // Disable autocomplete on the form
      instance.input.parentNode.setAttribute("autocomplete", "off");
      // Disable form submission for demo purposes
      instance.input.parentNode.addEventListener("submit", function (event) {
        event.preventDefault();
      });
      // Apply focus to input
      if (instance.applyFocus) {
        instance.input.focus();
      }
    }
    window.addEventListener("click", function () {
      instance.picklist.hide();
    });
  };

  instance.unbind = function () {
    if (instance.elements.input) {
      instance.input = instance.elements.input;
      // Unbind previously bound listeners.
      instance.input.removeEventListener("keyup", instance.search);
      instance.input.removeEventListener("keydown", instance.checkTab);
      instance.input.parentNode.removeAttribute("autocomplete");
    }
  };
  // Main function to search for an address from an input string
  instance.search = function (event) {
    // Handle keyboard navigation
    var e = event || window.event;
    e = e.which || e.keyCode;
    if (e === 38 /*Up*/ || e === 40 /*Down*/ || e === 13 /*Enter*/) {
      instance.picklist.keyup(e);
      return;
    }

    instance.currentSearchTerm = instance.input.value;

    // Grab the country ISO code and (if it is present) the dataset name from the current value of the countryList (format: {countryIsoCode};{dataset})
    var currentCountryInfo = instance.countryCodeMapping[instance.countryList.value] || instance.countryList.value;
    currentCountryInfo = currentCountryInfo.split(";");

    instance.currentCountryCode = currentCountryInfo[0];
    instance.currentDataSet = currentCountryInfo[1] || "";

    // (Re-)set the property stating whether the search input has been reset.
    // This is needed for instances when the search input is also an address
    // output field. After an address has been returned, you don't want a new
    // search being triggered until the field has been cleared.
    if (instance.currentSearchTerm === "") {
      instance.hasSearchInputBeenReset = true;
    }

    // Check is searching is permitted
    if (instance.canSearch()) {
      // Abort any outstanding requests
      if (instance.request.currentRequest) {
        instance.request.currentRequest.abort();
      }

      // Fire an event before a search takes place
      instance.events.trigger("pre-search", instance.currentSearchTerm);

      // Construct the new Search URL and data
      var url = ContactDataServices.urls.construct.address.searchUrl();
      var data = ContactDataServices.urls.construct.address.searchData(instance);

      // Store the last search term
      instance.lastSearchTerm = instance.currentSearchTerm;

      // Hide any previous results
      instance.result.hide();

      // Hide the inline search spinner
      instance.searchSpinner.hide();

      // Show an inline spinner whilst searching
      instance.searchSpinner.show();

      // Initiate new Search request
      instance.request.send(url, "POST", instance.picklist.show, data);
    } else if (instance.lastSearchTerm !== instance.currentSearchTerm) {
      // Clear the picklist if the search term is cleared/empty
      instance.picklist.hide();
    }
  };

  instance.setCountryList = function () {
    instance.countryList = instance.elements.countryList;

    // If the user hasn't passed us a country list, then create new list?
    if (!instance.countryList) {
      instance.createCountryDropdown();
    }
  };

  // Determine whether searching is currently permitted
  instance.canSearch = function () {
    // If searching on this instance is enabled, and
    return (
      instance.enabled &&
      // If search term is not empty, and
      instance.currentSearchTerm !== "" &&
      // If search term is not the same as previous search term, and
      instance.lastSearchTerm !== instance.currentSearchTerm &&
      // If the country is not empty, and
      instance.countryList.value !== undefined &&
      instance.countryList.value !== "" &&
      // If search input has been reset (if applicable)
      instance.hasSearchInputBeenReset === true
    );
  };

  //Determine whether tab key was pressed
  instance.checkTab = function (event) {
    var e = event || window.event;
    e = e.which || e.keyCode;
    if (e === 9 /*Tab*/) {
      instance.picklist.keyup(e);
      return;
    }
  };

  instance.createCountryDropdown = function () {
    // What countries?
    // Where to position it?
    instance.countryList = {};
  };

  // Get a final (Formatted) address
  instance.format = function (url) {
    // Trigger an event
    instance.events.trigger("pre-formatting-search", url);

    // Hide the searching spinner
    instance.searchSpinner.hide();

    // Construct the format URL
    instance.currentFormatUrl = url;

    // Initiate a new Format request
    instance.request.send(instance.currentFormatUrl, "GET", instance.result.show);
  };

  instance.picklist = {
    // Set initial size
    size: 0,
    // Set initial max size
    maxSize: 25,
    // Render a picklist of search results
    show: function (items) {
      // Store the picklist items
      instance.picklist.items = items.result.suggestions;

      // Reset any previously selected current item
      instance.picklist.currentItem = null;

      // Update picklist size
      instance.picklist.size = instance.picklist.items.length;

      // Get/Create picklist container element
      instance.picklist.list = instance.picklist.list || instance.picklist.createList();

      // Ensure previous results are cleared
      instance.picklist.list.innerHTML = "";

      // Reset the picklist tab count (used for keyboard navigation)
      instance.picklist.resetTabCount();

      // Hide the inline search spinner
      instance.searchSpinner.hide();

      // Prepend an option for "use address entered"
      if (instance.manualEntry.visible) {
        instance.picklist.useAddressEntered.element = instance.picklist.useAddressEntered.element || instance.picklist.useAddressEntered.create();
        instance.picklist.list.parentNode.classList.add("has-content");
      }

      if (instance.picklist.size > 0) {
        // Fire an event before picklist is created
        instance.events.trigger("pre-picklist-create", instance.picklist.items);

        if (instance.infoAlert.visible && items.result.more_results_available) {
          instance.picklist.infoAlert.element = instance.picklist.infoAlert.element || instance.picklist.infoAlert.create();
        } else {
          instance.picklist.infoAlert.destroy();
        }

        // Iterate over and show results
        instance.picklist.items.forEach(function (item) {
          // Create a new item/row in the picklist
          var listItem = instance.picklist.createListItem(item);
          instance.picklist.list.appendChild(listItem);

          // Listen for selection on this item
          instance.picklist.listen(listItem);
        });
        instance.picklist.list.parentNode.classList.add("has-content");
        // Fire an event after picklist is created
        instance.events.trigger("post-picklist-create", items.result);
      } else {
        if(instance.picklist.useAddressEntered.element === undefined)
          instance.picklist.list.parentNode.classList.remove("has-content");
        if (instance.infoAlert.visible)
          instance.picklist.infoAlert.destroy();
        instance.events.trigger("picklist-empty", items.result);
      }
    },
    // Remove the picklist
    hide: function () {
      // Clear the current picklist item
      instance.picklist.currentItem = null;
      // Remove the "use address entered" option too
      instance.picklist.useAddressEntered.destroy();
      instance.picklist.infoAlert.destroy();
      // Remove the main picklist container
      if (instance.picklist.list) {
        instance.input.parentNode.removeChild(instance.picklist.container);
        instance.picklist.list = undefined;
      }
    },

    infoAlert: {
      create: function () {
        var alert = document.createElement("div");
        alert.setAttribute("class", "more-results-available alert alert-info");
        var text = document.createTextNode(instance.infoAlert.text);
        alert.appendChild(text);
        instance.picklist.list.parentNode.insertBefore(alert, instance.picklist.list);

        if(instance.infoAlert.popoverBtn && instance.infoAlert.popoverBtn.visible){
          var popoverBtn = document.createElement("a");
          popoverBtn.setAttribute("class", "btn btn-info");
          popoverBtn.setAttribute("tabindex", "0");
          popoverBtn.setAttribute("role", "button");
          popoverBtn.setAttribute("data-toggle", "popover");
          popoverBtn.setAttribute("title", instance.infoAlert.popoverBtn.title);
          popoverBtn.setAttribute("data-content", instance.infoAlert.popoverBtn.text);
          popoverBtn.innerHTML = instance.infoAlert.popoverBtn.icon;
          alert.appendChild(popoverBtn);
          $(".more-results-available .btn").popover();
        }
        return alert;
      },

      destroy: function () {
        if (instance.picklist.infoAlert.element) {
          instance.picklist.list.parentNode.removeChild(instance.picklist.infoAlert.element);
          instance.picklist.infoAlert.element = undefined;
        }
      },
    },
    useAddressEntered: {
      // Create a "use address entered" option
      create: function () {
        var item = {
          text: instance.manualEntry.text,
          format: "",
        };
        var listItem = instance.picklist.createListItem(item);
        listItem.classList.add("use-address-entered");
        instance.picklist.list.parentNode.insertBefore(listItem, instance.picklist.list.nextSibling);
        instance.picklist.list.parentNode.classList.add("has-content");
        listItem.addEventListener("click", instance.picklist.useAddressEntered.click);
        return listItem;
      },
      // Destroy the "use address entered" option
      destroy: function () {
        if (instance.picklist.useAddressEntered.element) {
          instance.picklist.list.parentNode.removeChild(instance.picklist.useAddressEntered.element);
          instance.picklist.useAddressEntered.element = undefined;
        }
      },
      // Use the address entered as the Formatted address
      click: function () {
        var inputData = {
          result: {
            address: {
              address_line_1: "",
              address_line_2: "",
              address_line_3: "",
              locality: "",
              region: "",
              postal_code: "",
              country: "",
            },
          },
        };

        if (instance.currentSearchTerm) {
          // Try and split into lines by using comma delimiter
          var lines = instance.currentSearchTerm.split(",");
          if (lines[0]) {
            inputData.result.address.address_line_1 = lines[0];
          }
          if (lines[1]) {
            inputData.result.address.address_line_2 = lines[1];
          }
          if (lines[2]) {
            inputData.result.address.address_line_3 = lines[2];
          }
          for (var i = 3; i < lines.length; i++) {
            inputData.result.address.address_line_3 += lines[i];
          }
        }

        instance.result.show(inputData);
        instance.result.updateHeading(instance.formattedAddressContainer.manualHeadingText);
        instance.events.trigger("manual-entry");
      },
      // Create and return an address line object with the key as the label
      formatManualAddressLine: function (lines, i) {
        var key = ContactDataServices.defaults.addressLineLabels[i];
        var lineObject = {};
        lineObject[key] = lines[i] || "";
        return lineObject;
      },
    },
    // Create the picklist list (and container) and inject after the input
    createList: function () {
      var container = document.createElement("div");
      container.classList.add("address-picklist-container");
      container.addEventListener("click", function (event) {
        event.stopPropagation();
      });
      // Insert the picklist container after the input
      instance.input.parentNode.insertBefore(container, instance.input.nextSibling);
      instance.picklist.container = container;

      var list = document.createElement("div");
      list.classList.add("address-picklist");
      // Append the picklist to the container
      container.appendChild(list);

      list.addEventListener("keydown", instance.picklist.enter);
      return list;
    },
    // Create a new picklist item/row
    createListItem: function (item) {
      var row = document.createElement("div");
      row.innerHTML = instance.picklist.addMatchingEmphasis(item);
      // Store the Format URL
      row.setAttribute("format", item.format);
      return row;
    },
    // Tab count used for keyboard navigation
    tabCount: -1,
    resetTabCount: function () {
      instance.picklist.tabCount = -1;
    },
    // Keyboard navigation
    keyup: function (e) {
      if (!instance.picklist.list) {
        return;
      }

      if (e === 13 /*Enter*/ || e === 9 /*Tab*/) {
        instance.picklist.checkEnter();
        return;
      }

      // Get a list of all the addresses in the picklist
      var addresses = instance.picklist.list.querySelectorAll("div"),
        firstAddress,
        lastAddress;

      // If the picklist is empty, just return
      if (addresses.length === 0) {
        return;
      }

      // Set the tabCount based on previous and direction
      if (e === 38 /*Up*/) {
        instance.picklist.tabCount--;
      } else {
        instance.picklist.tabCount++;
      }

      // Set top and bottom positions and enable wrap-around
      if (instance.picklist.tabCount < 0) {
        instance.picklist.tabCount = addresses.length - 1;
        lastAddress = true;
      }
      if (instance.picklist.tabCount > addresses.length - 1) {
        instance.picklist.tabCount = 0;
        firstAddress = true;
      }

      // Highlight the selected address
      var currentlyHighlighted = addresses[instance.picklist.tabCount];
      // Remove any previously highlighted ones
      var previouslyHighlighted = instance.picklist.list.querySelector(".selected");
      if (previouslyHighlighted) {
        previouslyHighlighted.classList.remove("selected");
      }
      currentlyHighlighted.classList.add("selected");
      // Set the currentItem on the picklist to the currently highlighted address
      instance.picklist.currentItem = currentlyHighlighted;

      // Scroll address into view, if required
      var addressListCoords = {
        top: instance.picklist.list.offsetTop,
        bottom: instance.picklist.list.offsetTop + instance.picklist.list.offsetHeight,
        scrollTop: instance.picklist.list.scrollTop,
        selectedTop: currentlyHighlighted.offsetTop,
        selectedBottom: currentlyHighlighted.offsetTop + currentlyHighlighted.offsetHeight,
        scrollAmount: currentlyHighlighted.offsetHeight,
      };
      if (firstAddress) {
        instance.picklist.list.scrollTop = 0;
      } else if (lastAddress) {
        instance.picklist.list.scrollTop = 999;
      } else if (addressListCoords.selectedBottom + addressListCoords.scrollAmount > addressListCoords.bottom) {
        instance.picklist.list.scrollTop = addressListCoords.scrollTop + addressListCoords.scrollAmount;
      } else if (addressListCoords.selectedTop - addressListCoords.scrollAmount - addressListCoords.top < addressListCoords.scrollTop) {
        instance.picklist.list.scrollTop = addressListCoords.scrollTop - addressListCoords.scrollAmount;
      }
    },
    // Add emphasis to the picklist items highlighting the match
    addMatchingEmphasis: function (item) {
      var dataset = "";
      if (item.dataset) {
        dataset = "[" + item.dataset + "]";
      }
      var highlights = item.matched || [],
        label = dataset + item.text;
      for (var i = 0; i < highlights.length; i++) {
        var replacement = "<b>" + label.substring(highlights[i][0], highlights[i][1]) + "</b>";
        label = label.substring(0, highlights[i][0]) + replacement + label.substring(highlights[i][1]);
      }

      return label;
    },
    // Listen to a picklist selection
    listen: function (row) {
      row.addEventListener("click", instance.picklist.pick.bind(null, row));
    },
    checkEnter: function () {
      var picklistItem;
      // If picklist contains 1 address then use this one to format
      if (instance.picklist.size === 1) {
        picklistItem = instance.picklist.list.querySelectorAll("div")[0];
      } // Else use the currently highlighted one when navigation using keyboard
      else if (instance.picklist.currentItem) {
        picklistItem = instance.picklist.currentItem;
      }
      if (picklistItem) {
        instance.picklist.pick(picklistItem);
      }
    },
    // How to handle a picklist selection
    pick: function (item) {
      // Fire an event when an address is picked
      instance.events.trigger("post-picklist-selection", item);

      // Get a final address using picklist item
      instance.format(item.getAttribute("format"));
    },
  };

  instance.result = {
    // Render a Formatted address
    show: function (data) {
      // Hide the inline search spinner
      instance.searchSpinner.hide();

      // Hide the picklist
      instance.picklist.hide();

      // Clear search input
      instance.input.value = "";

      if (data.result.address) {
        // Create an array to hold the hidden input fields
        var inputArray = [];

        // Get formatted address container element
        // Only create a container if we're creating inputs. otherwise the user will have their own container.
        instance.result.formattedAddressContainer = instance.elements.formattedAddressContainer;
        if (!instance.result.formattedAddressContainer && instance.result.generateAddressLineRequired) {
          instance.result.createFormattedAddressContainer();
        }

        instance.result.updateAddressLine("address_line_1", data.result.address.address_line_1, "address-line-input");
        instance.result.updateAddressLine("address_line_2", data.result.address.address_line_2, "address-line-input");
        instance.result.updateAddressLine("address_line_3", data.result.address.address_line_3, "address-line-input");
        instance.result.updateAddressLine("locality", data.result.address.locality, "address-line-input");
        instance.result.updateAddressLine("region", data.result.address.region, "address-line-input");
        instance.result.updateAddressLine("postal_code", data.result.address.postal_code, "address-line-input");
        instance.result.updateAddressLine("country", data.result.address.country, "address-line-input");

        // Hide country and address search fields (if they have a 'toggle' class)
        instance.result.hideSearchInputs();

        // Write the 'Search again' link and insert into DOM
        instance.result.createSearchAgainLink();

        // If an address line is also the search input, set property to false.
        // This ensures that typing in the field again (after an address has been
        // returned) will not trigger a new search.
        for (var element in instance.elements) {
          if (instance.elements.hasOwnProperty(element)) {
            // Excluding the input itself, does another element match the input field?
            if (element !== "input" && instance.elements[element] === instance.elements.input) {
              instance.hasSearchInputBeenReset = false;
              break;
            }
          }
        }
      }

      // Fire an event to say we've got the formatted address
      instance.events.trigger("post-formatting-search", data);
    },
    hide: function () {
      // Delete the formatted address container
      if (instance.result.formattedAddressContainer) {
        instance.input.parentNode.removeChild(instance.result.formattedAddressContainer);
        instance.result.formattedAddressContainer = undefined;
      }
      // Delete the search again link
      if (instance.searchAgain.link) {
        instance.searchAgain.link.parentNode.removeChild(instance.searchAgain.link);
        instance.searchAgain.link = undefined;
      }
      // Remove previous value from user's result field
      // Loop over their elements
      for (var element in instance.elements) {
        if (instance.elements.hasOwnProperty(element)) {
          // If it matches an "address" element
          for (var i = 0; i < ContactDataServices.defaults.addressLineLabels.length; i++) {
            var label = ContactDataServices.defaults.addressLineLabels[i];
            // Only reset the value if it's not an input field
            if (label === element && instance.elements[element] !== instance.elements.input) {
              instance.elements[element].value = "";
              break;
            }
          }
        }
      }
    },
    // Create the formatted address container and inject after the input
    createFormattedAddressContainer: function () {
      var container = document.createElement("div");
      container.classList.add("formatted-address");

      // Insert the container after the input
      instance.input.parentNode.insertBefore(container, instance.input.nextSibling);
      instance.result.formattedAddressContainer = container;
    },
    // Create a heading for the formatted address container
    createHeading: function () {
      // Create a heading for the formatted address
      if (instance.formattedAddressContainer.showHeading) {
        var heading = document.createElement(instance.formattedAddressContainer.headingType);
        heading.innerHTML = instance.formattedAddressContainer.validatedHeadingText;
        instance.result.formattedAddressContainer.appendChild(heading);
      }
    },
    // Update the heading text in the formatted address container
    updateHeading: function (text) {
      //Change the heading text to "Manual address entered"
      if (instance.formattedAddressContainer.showHeading) {
        var heading = instance.result.formattedAddressContainer.querySelector(instance.formattedAddressContainer.headingType);
        heading.innerHTML = text;
      }
    },
    updateAddressLine: function (key, addressLineObject, className) {
      // Either append the result to the user's address field or create a new field for them
      if (instance.elements[key]) {
        var addressField = instance.elements[key];
        instance.result.updateLabel(key);
        var value = addressLineObject;
        // If a value is already present, prepend a comma and space
        if (addressField.value && value) {
          value = ", " + value;
        }
        // Decide what property of the node we need to update. i.e. if it's not a form field, update the innerText.
        if (addressField.nodeName === "INPUT" || addressField.nodeName === "TEXTAREA" || addressField.nodeName === "SELECT") {
          addressField.value += value;
        } else {
          addressField.innerText += value;
        }
        // Store a record of their last address field
        instance.result.lastAddressField = addressField;
      }
    },
    // Update the label if translation is present
    updateLabel: function (key) {
      var label = key;
      var language = instance.language.toLowerCase();
      var country = instance.currentCountryCode.toLowerCase();
      var translations = ContactDataServices.translations;
      if (translations) {
        try {
          var translatedLabel = translations[language][country][key];
          if (translatedLabel) {
            label = translatedLabel;
            var labels = document.getElementsByTagName("label");
            for (var i = 0; i < labels.length; i++) {
              if (labels[i].htmlFor === key) {
                labels[i].innerHTML = translatedLabel;
              }
            }
          }
        } catch (e) {
          // Translation doesn't exist for key
        }
      }
      return label;
    },
    // Create the 'Search again' link that resets the search
    createSearchAgainLink: function () {
      if (instance.searchAgain.visible) {
        var link = document.createElement("a");
        link.setAttribute("href", "#");
        link.classList.add("search-again-link");
        link.innerHTML = instance.searchAgain.text;
        // Bind event listener
        link.addEventListener("click", instance.reset);
        // Store a reference to the link element
        instance.searchAgain.link = link;

        // Insert into the formatted address container
        if (instance.result.formattedAddressContainer) {
          instance.result.formattedAddressContainer.appendChild(link);
        } else {
          // Insert after last address field
          instance.result.lastAddressField.parentNode.insertBefore(link, instance.result.lastAddressField.nextSibling);
        }
      }
    },
    // Write the list of hidden address line inputs to the DOM
    renderInputList: function (inputArray) {
      if (inputArray.length > 0) {
        for (var i = 0; i < inputArray.length; i++) {
          instance.result.formattedAddressContainer.appendChild(inputArray[i]);
        }
      }
    },
    // Hide the initial country and address search inputs
    hideSearchInputs: function () {
      instance.toggleVisibility(instance.input.parentNode);
    },
  };

  // Toggle the visibility of elements
  instance.toggleVisibility = function (scope) {
    scope = scope || document;
    var elements = scope.querySelectorAll(".toggle");
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains("hidden")) {
        elements[i].classList.remove("hidden");
      } else {
        elements[i].classList.add("hidden");
      }
    }
  };

  instance.searchSpinner = {
    show: function () {
      // Return if we're not displaying a spinner
      if (!instance.useSpinner) {
        return;
      }
      // Create the spinner container
      var spinnerContainer = document.createElement("div");
      spinnerContainer.classList.add("loader");
      spinnerContainer.classList.add("loader-inline");

      // Create the spinner
      var spinner = document.createElement("div");
      spinner.classList.add("spinner");
      spinnerContainer.appendChild(spinner);

      // Insert the spinner after the field
      instance.input.parentNode.insertBefore(spinnerContainer, instance.input.nextSibling);
    },

    hide: function () {
      // Return if we're not displaying a spinner
      if (!instance.useSpinner) {
        return;
      }
      var spinner = instance.input.parentNode.querySelector(".loader-inline");
      if (spinner) {
        instance.input.parentNode.removeChild(spinner);
      }
    },
  };

  // Reset the search
  instance.reset = function (event) {
    if (event) {
      event.preventDefault();
    }
    // Enable searching
    instance.enabled = true;
    // Hide formatted address
    instance.result.hide();
    // Clear the input field
    instance.input.value = "";
    // Reset search input back
    instance.hasSearchInputBeenReset = true;
    // Show search input
    instance.toggleVisibility(instance.input.parentNode);
    // Apply focus to input
    instance.input.focus();

    // Fire an event after a reset
    instance.events.trigger("post-reset");
  };

  // How to handle request errors
  instance.handleError = {
    // How to handle 400 Bad Request
    badRequest: function (xhr) {
      instance.enabled = false;

      // As searching is disabled, show button to render final address instead
      //instance.handleError.showSubmitButton();

      // Fire an event to notify users of the error
      instance.events.trigger("request-error-400", xhr);
    },

    // How to handle 401 Unauthorized (invalid token?) requests
    unauthorized: function (xhr) {
      instance.enabled = false;

      // As searching is disabled, show button to render final address instead
      //instance.handleError.showSubmitButton();

      // Fire an event to notify users of the error
      instance.events.trigger("request-error-401", xhr);
    },

    // How to handle 403 Forbidden requests
    forbidden: function (xhr) {
      instance.enabled = false;

      // As searching is disabled, show button to render final address instead
      //instance.handleError.showSubmitButton();

      // Fire an event to notify users of the error
      instance.events.trigger("request-error-403", xhr);
    },

    // How to handle 404 Not Found requests
    notFound: function (xhr) {
      instance.enabled = false;

      // As searching is disabled, show button to render final address instead
      //instance.handleError.showSubmitButton();

      // Fire an event to notify users of the error
      instance.events.trigger("request-error-404", xhr);
    },

    // As searching is disabled, show button to render final address instead
    showSubmitButton: function () {
      var button = document.createElement("button");
      button.innerText = "Submit";
      instance.input.parentNode.insertBefore(button, instance.input.nextSibling);
      button.addEventListener("click", function () {
        // Simulate a manual "use address entered" entry
        instance.picklist.useAddressEntered.click();
        // Remove the button
        instance.input.parentNode.removeChild(button);
      });
    },
  };

  // Use this to initiate and track XMLHttpRequests
  instance.request = {
    currentRequest: null,
    send: function (url, method, callback, data) {
      instance.request.currentRequest = new XMLHttpRequest();
      instance.request.currentRequest.open(method, url, true);
      instance.request.currentRequest.timeout = 5000; // 5 seconds
      instance.request.currentRequest.setRequestHeader("auth-token", instance.token);
      instance.request.currentRequest.setRequestHeader("Content-Type", "application/json");
      instance.request.currentRequest.setRequestHeader("Accept", "application/json");

      instance.request.currentRequest.onload = function (xhr) {
        if (instance.request.currentRequest.status >= 200 && instance.request.currentRequest.status < 400) {
          // Success!
          var data = JSON.parse(instance.request.currentRequest.responseText);
          instance.request.latestResult = data;
          callback(data);
        } else {
          instance.request.latestResult = {};

          // We reached our target server, but it returned an error
          instance.searchSpinner.hide();

          // Fire an event to notify users of an error
          instance.events.trigger("request-error", xhr);

          // If the request is 400 Bad Request
          if (instance.request.currentRequest.status === 400) {
            instance.handleError.badRequest(xhr);
          }
          // If the request is 401 Unauthorized (invalid token) we should probably disable future requests
          else if (instance.request.currentRequest.status === 401) {
            instance.handleError.unauthorized(xhr);
          }
          // If the request is 403 Forbidden
          else if (instance.request.currentRequest.status === 403) {
            instance.handleError.forbidden(xhr);
          }
          // If the request is 404 Not Found
          else if (instance.request.currentRequest.status === 404) {
            instance.handleError.notFound(xhr);
          }
        }
      };

      instance.request.currentRequest.onerror = function (xhr) {
        // There was a connection error of some sort
        // Hide the inline search spinner
        instance.searchSpinner.hide();

        // Fire an event to notify users of an error
        instance.events.trigger("request-error", xhr);
      };

      instance.request.currentRequest.ontimeout = function (xhr) {
        // There was a connection timeout
        // Hide the inline search spinner
        instance.searchSpinner.hide();

        // Fire an event to notify users of the timeout
        instance.events.trigger("request-timeout", xhr);
      };

      instance.request.currentRequest.send(data);
    },
  };

  // Initialise this instance of ContactDataServices
  instance.init();

  // Return the instance object to the invoker
  return instance;
};

})(window, window.document);
