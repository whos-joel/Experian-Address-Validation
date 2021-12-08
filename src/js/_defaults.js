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
