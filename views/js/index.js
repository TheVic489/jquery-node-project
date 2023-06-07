/**
 * @file script.js
 * @version 1.1
 * @author Alumne DAW Bio2
 */

// -- Imports --
// import Account from "./Account"; //  no hace falta

// -- Main --
$(document).ready(function () {
	// Al carrega, amagar divs
	$("#myProjects").hide();
	$("#intranet").hide();
	$("#fromProject").hide();

	$("#BtAboutMe").click(function () {
		$("#aboutMe").show();
		$("#myProjects").hide();
		$("#intranet").hide();
	});
	$("#BtMyProjects").click(function () {
		$("#myProjects").show();
		$("#aboutMe").hide();
		$("#intranet").hide();
		
	});
	$("#BtIntranet").click(function () {
		$("#myProjects").hide();
		$("#aboutMe").hide();
		if (logged) {
			console.log(logged)
			$("#formLogin").hide();
			$("#formProject").show();
		}else {
			$("#formLogin").show();
			$("#formProject").hide();
		}
		$("#intranet").show();
	});

	$("#error-server-msg").hide();
	$("#success-server-msg").hide();


	dologin();
	setDatePicker();
	let logged = localStorage.getItem("session");

	

	// Select Option Form
	let programLangArray = ["Python", "PHP", "Jquery"];
	let selectElement = $("#tuSelect");
	programLangArray.forEach((item) => {
		selectElement.append(
			'<option value="' + item + '">' + item + "</option>"
		);
	});

	// Validate Project Form //
	$("#tuNombre").change(function () {
		let isValid = validateName($(this));
		setValidatorState(isValid, $(this));
		validateAllForm()
	});
	$("#tuDescripcion").change(function () {
		let isValid = validateTextArea($(this));
		setValidatorState(isValid, $(this));
		validateAllForm()

	});
	$("#tuDatePicker").change(function () {
		let isValid =  validateDate($(this));
		setValidatorState(isValid, $(this));
		validateAllForm()
	});
	$('input[type="radio"][name="categoria"]').change(function () {
		isValid = true;
		setValidatorState(isValid, $(this));
		validateAllForm()
	});


	//-----------SUBMIT BUTTON EVENT------------//
	$("#btProject").click(function () {
		let name 		= $("#tuNombre").val();
		let descripcion = $("#tuDescripcion").val();
		let category    = $('input[type="radio"][name="categoria"]:checked').val();
		let entry_dates = $("#tuDatePicker").val();
		let lang        = $("#tuNombre").val();
		
		let projectObj = new Project(name, descripcion, category, entry_dates, lang);
		let projectStr = JSON.stringify(projectObj)
		console.log(projectStr);
		$.ajax({
			type: "POST",
			url: "http://localhost:3000/add/project",
			data: { project: projectStr },
			dataType: "json",
			success: function (result) {
			  console.log("Llamada a api, add project");
			  server_response = result.response;

			  if (server_response !== null) {
				$("#success-server-msg").text("Added project successfully");
				$("#success-server-msg").show();
				$("#error-server-msg").hide();
				// setTimeout(function () {
				//   $("#spinner").hide();
				//   $("#success-icon").show();
				// }, 3000);
			  } else {
				$("error-server-msg").text("Error, Try again");
				$("#error-server-msg").show();
				$("#success-server-msg").hide();
			  }
			},
		  });

		});	
	//-----------------FUNCTIONS---------------//
	function dologin() {
		$("#btLogin").click(function () {
			let username = $("#tuUsername").val();
			let password = $("#tuPassword").val();

			if (username == "projecte" && password == "dawbio") {
				console.log('Login successful')
				localStorage.setItem("session", "logged");
					
				location.reload(); // Recargar la página actual

				$("#errorLogin").html("");
				$("#formLogin").hide();
				$("#formProject").show();
			} else {
				$("#errorLogin").html("Credencials Incorrectes");
			}
		});
	}
	function validateAllForm() {
		let name = $("#tuNombre");
		let descripcion = $("#tuDescripcion");
		let entry_dates = $("#tuDatePicker");
		let category    = $('input[type="radio"][name="categoria"]:checked');
	
		validName        = name.hasClass("success");
		validDescription = descripcion.hasClass("success");
		validDate        = entry_dates.hasClass("success");
		validCategory    = category.hasClass("success");

		console.log(validName, validDescription, validDate)

		if (validName && validDescription && validDate && validCategory) {
			$('#errorProjects').html("")
			console.log('En valido')
			$("#btProject").prop('disabled', false);
		} else {
			$('#errorProjects').html("Revisa el formulario, hay un error")
			$("#btProject").prop('disabled', true);

		  }
		}

	function setValidatorState (isValid, inputSelector) {
		if (isValid == true) { 
			$(inputSelector).removeClass("error");
			$(inputSelector).addClass("success");
		}else {
			$(inputSelector).removeClass("success");
			$(inputSelector).addClass("error");
		}
	}
	/**
	 * Function that validates client's full name by a regExp
	 * @param {*} name client name
	 * @returns true or false
	 */
	function validateName(name) {
		let name_value = $(name).val();
		const regExp =
			/(^[a-zA-Z \u00C0-\u017F]{3,16})([ ]{0,1})([a-zA-Z\u00C0-\u017F]{3,16})?([ ]{0,1})?([a-zA-Z\u00C0-\u017F]{3,16})?([ ]{0,1})?([a-zA-Z\u00C0-\u017F]{3,16})/;

		if (regExp.test(name_value)) {
			return true;
		} else {
			return false;
		}
	}

	function validateTextArea(descripcion) {
		let description_value = $(descripcion).val();
		if (description_value.length >= 1 && description_value.length < 100) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Function that valisdate if date picked by user to modify it it is a valid date or not
	 * @param {*} date new date to modify
	 * @returns true or false
	 */
	function validateDate(date) {
		let bd_date = $(date).val();
		let new_date = new Date(bd_date);
		let today = new Date();
		//? To solve the problem when user put today date compared to today
		//? Reset the time to solve miliseconds bug
		today.setHours(0, 0, 0, 0);
		new_date.setHours(0, 0, 0, 0);

		let correct_date = new_date.getTime() < today.getTime();

		if (correct_date) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * Function to set datePicker
	 */
	function setDatePicker() {
		$.datepicker.regional["ca"] = {
			closeText: "Tanca",
			prevText: "< Anterior",
			nextText: "Següent >",
			currentText: "Avui",
			monthNames: [
				"Gener",
				"Febrer",
				"Març",
				"Abril",
				"Maig",
				"Juny",
				"Juliol",
				"Agost",
				"Setembre",
				"Octubre",
				"Novembre",
				"Decembre",
			],
			monthNamesShort: [
				"Gen",
				"Feb",
				"Març",
				"Abr",
				"Maig",
				"Juny",
				"Jul",
				"Ago",
				"Sep",
				"Oct",
				"Nov",
				"Des",
			],
			dayNames: [
				"Diumenge",
				"Dilluns",
				"Dimarts",
				"Dimecres",
				"Dijuous",
				"Divendres",
				"Disabte",
			],
			dayNamesShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
			dayNamesMin: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
			weekHeader: "Sm",
			dateFormat: "mm/dd/yy",
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,
			yearSuffix: "",
		};
		$.datepicker.setDefaults($.datepicker.regional["ca"]);
		$("#tuDatePicker").datepicker();

	}
});
