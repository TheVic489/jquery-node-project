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
	$("#error-server-msg").hide();
	$("#success-server-msg").hide();

	//Click on about me, hide others
	$("#BtAboutMe").click(function () {
		$("#aboutMe").show();
		$("#myProjects").hide();
		$("#intranet").hide();
	});

	//Click on my projects, hide others
	$("#BtMyProjects").click(function () {
		$("#myProjects").show();
		$("#aboutMe").hide();
		$("#intranet").hide();
		
	});

	//Click on Intranet, hide others
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
	
	dologin();       // Init login function 
	setDatePicker(); // Init date picker
	
	// Init vars
	let logged = localStorage.getItem("session");
	// Select Option Form
	let programLangArray = ["Python", "PHP", "Jquery"];
	let selectElement = $("#tuSelect");
	programLangArray.forEach((item) => {
		selectElement.append(
			'<option value="' + item + '">' + item + "</option>"
		);
	});

	// --- Validate Project Form --- //
	$("#tuNombre").change(function () {
		let isValid = validateName($(this));
		if (!isValid) {
		}
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
		let lang        = $("#tuSelect").val();
		
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
			  console.log("Mensaje server:");
			  console.log('Response: ', server_response);
				
			  if (server_response !== null) {
				$("#success-server-msg").text("Added project successfully");
				$("#success-server-msg").show();
				$("#error-server-msg").hide();
				// setTimeout(function () {
				//   $("#spinner").hide();
				//   $("#success-icon").show();
				// }, 3000);
			  } else {
				$("#error-server-msg").text("Error, Try again");
				$("#error-server-msg").show();
				$("#success-server-msg").hide();
			  }
			},
			// error: function (error) {
			// 	console.log(error);
			// 	console.log(error.responseJSON.error);
			// 	$("#error-server-msg").text("Error, Try again");
			// 	$("#error-server-msg").show();
			// 	$("#success-server-msg").hide();
			// },
		  })
		  .fail(function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 400) {
			  // Ma	nejo específico para el error 400 (Bad Request)
			  console.log("Error 400: Bad Request");
				$("#error-server-msg").text("Error, Try again");
				$("#error-server-msg").show();
				$("#success-server-msg").hide();
			} else {
			  // Manejo general de otros errores
			  console.log("Error en la petición: " + textStatus + ", " + errorThrown);
			  $("#error-server-msg").text("Error, Try again");
			  $("#error-server-msg").show();
			  $("#success-server-msg").hide()
			}
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
			$('#errorProjects').html("Rellena todos los campos")
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
			$('#name-errmsg').empty();
			return true;
		} else {
			$('#name-errmsg').html('Invalid name');
			return false;
		}
	}

	function validateTextArea(descripcion) {
		let description_value = $(descripcion).val();
		if (description_value.length >= 1 && description_value.length < 100) {
			$('#textarea-errmsg').empty();
			return true;
		} else {
			$('#textarea-errmsg').html('Invalid description');
			return false;
		}
	}
	function validateEmail(email) {
		const regex = /^[a-zA-Z0-9.!/]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
		return regex.test(email);
	  }
	  
	function validateTel(tel) {
		const regex = /^\d{9}$/; // Expresión regular para validar 9 dígitos
		return regex.test(tel);
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
			$('#date-errmsg').empty();
			return true;
		} else {
			$('#date-errmsg').html('Invalid date');
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
