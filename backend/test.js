import bcrypt from "bcrypt";

const password = "EMP123";

// Generate a salt and hash the password
bcrypt.hash(password, 10, (err, hash) => {
	if (err) {
		console.error("Error hashing password:", err);
		return;
	}
	console.log("Hashed password:", hash);
});
