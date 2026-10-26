const form = document.querySelector("[data-inquiry-form]"); // Find the inquiry form on this page, if one exists.

if (form) { // Avoid running form code on landing pages that have no form.
	const fields = [...form.querySelectorAll("[data-field]")]; // Collect every input that needs validation.
	const successMessage = form.querySelector("[data-form-success]"); // Locate the confirmation shown after valid submission.
	const language = form.dataset.language === "en" ? "en" : "es"; // Select English messages only when the form declares English.
	const messages = { // Store field-specific validation text in both supported languages.
		es: { // Spanish messages are used by the default Spanish form.
			required: { // Explain which required field is missing.
				name: "Escribe tu nombre completo.", // Ask for the missing name.
				email: "Escribe tu correo electrónico.", // Ask for the missing email address.
				market: "Selecciona Colombia o Florida.", // Ask the user to choose a company market.
				message: "Escribe tu mensaje." // Ask for the missing message.
			}, // Finish the Spanish required-field messages.
			name: "Escribe un nombre de al menos 2 caracteres.", // Explain the minimum name length.
			email: "Escribe un correo válido, por ejemplo nombre@dominio.com.", // Show the expected email format.
			phone: "Escribe un teléfono válido con entre 7 y 15 dígitos.", // Explain the optional phone number's valid digit range.
			market: "Selecciona Colombia o Florida.", // Restrict the market choice to Brasaland's known markets.
			message: "Cuéntanos un poco más (mínimo 10 caracteres)." // Explain the minimum message length.
		}, // Finish the Spanish message set.
		en: { // English messages are used by the English form.
			required: { // Explain which required field is missing.
				name: "Please enter your full name.", // Ask for the missing name.
				email: "Please enter your email address.", // Ask for the missing email address.
				market: "Choose Colombia or Florida.", // Ask the user to choose a company market.
				message: "Please enter your message." // Ask for the missing message.
			}, // Finish the English required-field messages.
			name: "Enter a name with at least 2 characters.", // Explain the minimum name length.
			email: "Enter a valid email address, such as name@example.com.", // Show the expected email format.
			phone: "Enter a valid phone number with 7 to 15 digits.", // Explain the optional phone number's valid digit range.
			market: "Choose Colombia or Florida.", // Restrict the market choice to Brasaland's known markets.
			message: "Please add a little more detail (at least 10 characters)." // Explain the minimum message length.
		} // Finish the English message set.
	}[language]; // Use the messages matching the form's language.

	function getError(field) { // Return a helpful error message, or an empty string when the field is valid.
		const value = field.value.trim(); // Ignore surrounding whitespace when checking the user's entry.

		if (field.required && !value) { // Check required fields before checking their formats.
			return messages.required[field.name]; // Tell the user exactly which required value is missing.
		} // Finish the required-field check.

		if (field.name === "name" && value.length < 2) { // Require names to contain at least two characters.
			return messages.name; // Return the name-specific correction.
		} // Finish the name check.

		if (field.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) { // Check for a basic address@domain.tld pattern.
			return messages.email; // Return the email-specific correction.
		} // Finish the email check.

		if (field.name === "phone" && value) { // Validate the phone only when the optional field is filled in.
			const digits = value.replace(/\D/g, ""); // Count only digits, ignoring spaces and phone punctuation.
			if (!/^\+?[\d().\s-]+$/.test(value) || digits.length < 7 || digits.length > 15) { // Allow common formatting and an optional leading plus.
				return messages.phone; // Explain how to correct an invalid phone number.
			} // Finish the phone format and length checks.
		} // Finish the optional phone check.

		if (field.name === "market" && !["colombia", "florida"].includes(value)) { // Accept only the two company markets in the form.
			return messages.market; // Ask the user to select a supported market.
		} // Finish the market check.

		if (field.name === "message" && value.length < 10) { // Require enough detail for a useful inquiry.
			return messages.message; // Return the message-specific correction.
		} // Finish the message-length check.

		return ""; // An empty result means no validation error was found.
	} // Finish the function that checks one field.

	function validateField(field) { // Show or clear the error state for one field.
		const error = form.querySelector(`[data-error-for="${field.name}"]`); // Find the accessible message paired with the field.
		const message = getError(field); // Ask the validation rules whether the current value is valid.

		if (message) { // Apply error feedback when a rule returns a message.
			field.setAttribute("aria-invalid", "true"); // Tell assistive technology this field currently has an error.
			field.classList.add("border-[#a12f22]", "ring-1", "ring-[#a12f22]"); // Add a visible red border and ring.
			error.textContent = message; // Put the specific correction next to the field.
			error.hidden = false; // Reveal the error message for sighted users and screen readers.
			return false; // Report that this field did not pass validation.
		} // Finish the invalid-field branch.

		field.removeAttribute("aria-invalid"); // Remove the accessibility error state after correction.
		field.classList.remove("border-[#a12f22]", "ring-1", "ring-[#a12f22]"); // Restore the normal field border and ring.
		error.textContent = ""; // Clear the old error text.
		error.hidden = true; // Hide the now-unneeded error message.
		return true; // Report that this field passed validation.
	} // Finish the function that updates one field.

	fields.forEach((field) => { // Attach interaction handlers to every input.
		field.addEventListener("blur", () => validateField(field)); // Validate when the user leaves a field.
		field.addEventListener("input", () => { // Recheck text fields as the user types.
			if (field.hasAttribute("aria-invalid")) { // Avoid showing errors before the user first interacts.
				validateField(field); // Clear or update an existing error as the value changes.
			} // Finish the existing-error check for typing.
		}); // Finish the typing handler.
		field.addEventListener("change", () => { // Recheck selections when a choice changes.
			if (field.hasAttribute("aria-invalid")) { // Update only if the field already showed an error.
				validateField(field); // Clear or update the selection's existing error.
			} // Finish the existing-error check for selection.
		}); // Finish the selection handler.
	}); // Finish registering handlers for all fields.

	form.addEventListener("submit", (event) => { // Handle form submission without sending data to a server.
		event.preventDefault(); // Stop the browser from navigating away or submitting data.
		const invalidFields = fields.filter((field) => !validateField(field)); // Validate all inputs and collect any failures.

		if (invalidFields.length) { // Keep the form in place when any field is invalid.
			successMessage.hidden = true; // Hide an earlier confirmation if the new attempt has errors.
			invalidFields[0].focus(); // Move keyboard focus to the first field that needs attention.
			return; // Do not display success for invalid data.
		} // Finish the invalid-submission branch.

		successMessage.hidden = false; // Show the simulated confirmation after every field passes.
		successMessage.focus(); // Announce the confirmation and move focus to it.
	}); // Finish the submit handler.

	form.addEventListener("reset", () => { // Clear custom feedback when the user resets the form.
		window.setTimeout(() => { // Wait until the browser has restored each input's default value.
			fields.forEach((field) => { // Remove validation state from every input.
				field.removeAttribute("aria-invalid"); // Clear the accessibility error flag.
				field.classList.remove("border-[#a12f22]", "ring-1", "ring-[#a12f22]"); // Restore normal field styling.
				form.querySelector(`[data-error-for="${field.name}"]`).hidden = true; // Hide this field's old error message.
			}); // Finish clearing every field's feedback.
			successMessage.hidden = true; // Hide any earlier success confirmation.
		}, 0); // Run after the native reset event completes.
	}); // Finish the reset handler.
} // Finish setup when an inquiry form is present.
