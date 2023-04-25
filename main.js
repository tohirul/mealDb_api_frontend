// @ts-nocheck
const mealContainer = document.getElementById("meal-container");
const mealCategories = document.getElementById("meal-categories");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const pages = document.getElementById("pagination");

let letters = (function (capital = false) {
	return [...Array(26)].map((_, i) => String.fromCharCode(i + 97));
})();

for (const letter of letters) {
	(async function () {
		const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
		await fetch(url)
			.then((res) => res.json())
			.then((json) => pushMeals(json.meals));
	})();
}

searchBtn.onclick = () => {
	const searchText = searchInput.value;
	// console.log(searchText);
	searchInput.value = "";
	searchMeals(searchText);
};

const searchMeals = async (query) => {
	storeMeals = [];
	const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
	try {
		await fetch(url)
			.then((res) => res.json())
			.then((json) => pushMeals(json.meals));
	} catch (err) {
		console.error(err);
	} finally {
		console.log("Search Concluded");
	}
};

(async function () {
	const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
	await fetch(url)
		.then((res) => res.json())
		.then((json) => filterMeals(json.categories));
})();

const defaultCategories = ["All"];
const filterMeals = (fetchedCategories) => {
	fetchedCategories.forEach((item) => {
		defaultCategories.push(item.strCategory);
	});
	renderCategories(defaultCategories);
};

const renderCategories = (categories) => {
	mealCategories.innerHTML = ``;

	for (let i = 0; i < categories.length; i++) {
		const li = document.createElement("li");
		li.classList.add("page-item", "fs-6");
		li.style.cursor = "pointer";
		const span = document.createElement("span");
		span.classList.add("page-link");
		span.innerText = `${categories[i]}`;
		li.append(span);
		mealCategories.appendChild(li);

		li.onclick = () => {
			categorizeMeals(li.innerText);
		};
	}
};

let storeMeals = [];
const pushMeals = (meals) => {
	// console.log(meals);
	if (meals) {
		meals.forEach((meal) => {
			storeMeals.push(meal);
		});
	}
	// console.log(storeMeals);
	paginateMeals(storeMeals);
};

const paginateMeals = (storeMeals) => {
	// console.log(storeMeals);
	pages.innerHTML = ``;
	const mealsPerPage = 25;
	let currentPage = 1;
	const maxPages = Math.ceil(storeMeals.length / mealsPerPage);

	for (let i = 1; i <= maxPages; i++) {
		const li = document.createElement("li");
		li.classList.add("page-item");
		li.style.cursor = "pointer";
		const span = document.createElement("span");
		span.classList.add("page-link");
		span.innerText = `${i}`;
		li.append(span);
		pages.append(li);

		let startIndex = getIndex(currentPage, "startIndex");
		let endIndex = getIndex(currentPage, "endIndex");
		let pagedMeal = storeMeals.slice(startIndex, endIndex);
		renderMeals(pagedMeal);

		li.onclick = () => {
			currentPage = Number(span.innerText);
			startIndex = getIndex(currentPage, "startIndex");
			endIndex = getIndex(currentPage, "endIndex");
			pagedMeal = storeMeals.slice(startIndex, endIndex);
			renderMeals(pagedMeal);
		};
	}
};

const categorizeMeals = (textCategory) => {
	console.log(storeMeals, textCategory);
	if (textCategory.toLowerCase() === "all") {
		paginateMeals(storeMeals);
	} else {
		const checkedMeals = storeMeals.filter(
			(item) =>
				item.strCategory.toLowerCase() === textCategory.toLowerCase()
		);
		paginateMeals(checkedMeals);
	}
};

const getIndex = (currentPage, string) => {
	const totalPerPage = 18;
	if (string === "startIndex") {
		return totalPerPage * (currentPage - 1);
	} else {
		return totalPerPage * currentPage;
	}
};

const renderMeals = (meals) => {
	// console.log(meals);
	mealContainer.innerHTML = ``;
	meals.forEach((meal) => {
		// console.log(meal);
		const { strMeal, strMealThumb, strCategory } = meal;
		const div = document.createElement("div");
		div.classList.add("col-6", "p-4");
		div.innerHTML = `<div class="w-100 border rounded-3 shadow-sm bg-warning d-flex flex-row justify-justify-content-center align-items-top gap-0 transition" style="height: 312px">
							<div className="w-50">
                            	<img style="height:310px; max-height:310px; max-width:307px" class="img-fluid rounded-start" src=${strMealThumb} alt=${strMeal}  />
                            </div>
                            <div class="w-50 h-75 my-auto px-4  flex-grow-1 rounded-end-2">
                            	<p class="fs-5 fw-bold"style="word-wrap:break-word;overflow-wrap:break-word">${strMeal}</p>
                            	<p class="fs-6 fw-semibold">Category: ${strCategory}</p>
							</div>
						</div>`;

		mealContainer.appendChild(div);
	});
};
