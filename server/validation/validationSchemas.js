const yup = require("yup");

const registerSchema = yup.object().shape({
	body: yup.object({
		username: yup.string().required().matches("^[A-Za-z0-9]{3,20}$"),
		firstname: yup.string().required().matches("^[A-Za-z]{2,20}$"),
		lastname: yup.string().required().matches("^[A-Za-z]{2,20}$"),
		email: yup.string().required().email(),
		password: yup
			.string()
			.required()
			.matches(
				`^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!\@\#\$\%\^\&\*\,\.\;\:\~\|])[a-zA-Z0-9!\@\#\$\%\^\&\*\,\.\;\:\~\|]{8,20}$`
			),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("password"), null], "Passwords must match"),
	}),
});

const userSchema = yup.object().shape({
	body: yup.object({
		username: yup.string().required().matches("^[A-Za-z0-9]{3,20}$"),
		firstname: yup.string().required().matches("^[A-Za-z]{2,20}$"),
		lastname: yup.string().required().matches("^[A-Za-z]{2,20}$"),
		email: yup.string().required().email(),
	}),
});

const passwordSchema = yup.object().shape({
	body: yup.object({
		password: yup.string().required(),
		newPassword: yup
			.string()
			.required()
			.matches(
				`^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*,.;:~|])[a-zA-Z0-9!@#$%^&*,.;:~|]{8,20}$`
			),
	}),
});

//gets the possible genre ids which are allowed
const genreSchema = yup.object().shape({
	body: yup.object({
		genres: yup.array().of(yup.number()).required(),
	}),
});

const loginSchema = yup.object().shape({
	body: yup.object({
		username: yup.string().trim().required().matches(`^[A-Za-z0-9]*$`),
		password: yup.string().required(),
	}),
});

const searchSchema = yup.object().shape({
	query: yup.object({
		queryItem: yup.string().trim().required().matches("^.{1,64}$"),
	}),
});

const movieIdSchema = yup.object().shape({
	query: yup.object({ id: yup.number().integer().required() }),
});

const reviewSchema = yup.object().shape({
	body: yup.object({
		movie_id: yup.number().integer().required(),
		title: yup.string().trim().max(64).required(),
		content: yup.string().trim().max(2048).required(),
		score: yup.number().integer().min(1).max(5).required(),
		date: yup.date().default(function () {
			let today = new Date();
			return today;
		}),
	}),
});

const deleteReviewSchema = yup.object().shape({
	body: yup.object({ movie_id: yup.number().integer().required() }),
});

const postSchema = yup.object().shape({
	body: yup.object({
		title: yup.string().trim().max(64).required(),
		content: yup.string().trim().max(2048).required(),
		date: yup.date().default(function () {
			let today = new Date();
			return today;
		}),
	}),
});

const postIdSchema = yup.object().shape({
	body: yup.object({ post_id: yup.number().integer().required() }),
});

module.exports = {
	registerSchema,
	userSchema,
	passwordSchema,
	genreSchema,
	loginSchema,
	searchSchema,
	movieIdSchema,
	reviewSchema,
	deleteReviewSchema,
	postSchema,
	postIdSchema,
};
