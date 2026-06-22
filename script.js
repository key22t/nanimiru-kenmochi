let videos = [];

let currentSearch = "";
let currentSort = "random";
let currentGenres = [];
let currentDurations = [];
let currentYears = [];

const durationLabels = {

    under30: "30分未満",
    around1: "1時間程度",
    around2: "2時間程度",
    around3: "3時間程度",
    long: "3時間以上"

};

function formatDuration(seconds) {

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    return `${hours}時間${minutes}分`;
}

function displayVideos(videoData) {

    const videoList =
        document.getElementById("video-list");

    videoList.innerHTML = "";

    for (const video of videoData) {

        const card =
            document.createElement("div");

        card.classList.add("card");

        const thumbnail = document.createElement("img");

        thumbnail.src = video.thumbnail;
        thumbnail.classList.add("thumbnail");

        card.appendChild(thumbnail);

        const info =
            document.createElement("div");

        const title =
            document.createElement("div");

        title.textContent = video.title;
        title.classList.add("video-title");

        const duration =
            document.createElement("div");

        duration.textContent =
            formatDuration(video.duration);

        const date =
            document.createElement("div");

        date.textContent = video.publishedAt.split(" ")[0];

        info.appendChild(title);
        info.appendChild(duration);
        info.appendChild(date);

        card.appendChild(thumbnail);
        card.appendChild(info);

        card.classList.add("card");

        card.style.cursor = "pointer";

        card.onmouseover = () => {
            card.style.background = "#f5f5f5";
        };

        card.onmouseout = () => {
            card.style.background = "white";
        };

        videoList.appendChild(card);
        card.onclick = () => {
            window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank");
        };
    }
}

function hideIntroduce(){

    const introduce =
        document.getElementById("introduce");

    if(introduce){

        introduce.style.display = "none";

    }

}

function updateDisplay() {

    console.log(currentSort);

    let result =
        [...videos];

    if (currentGenres.length > 0) {

        result =
        result.filter(video =>
            currentGenres.includes(video.genre)
        );

    }
    
    if(currentDurations.length > 0){

    result =
    result.filter(video=>{

        const duration =
        video.duration;


        return currentDurations.some(type=>{


            if(type==="under30"){
                return duration < 1800;
            }


            if(type==="around1"){
                return duration >=1800 &&
                    duration <5400;
            }


            if(type==="around2"){
                return duration >=5400 &&
                    duration <9000;
            }


            if(type==="around3"){
                return duration >=9000 &&
                    duration <12600;
            }


            if(type==="long"){
                return duration >=12600;
            }


        });

    });


    }

    if (currentSort === "random") {

        result.sort(() => Math.random() - 0.5);

    } else if (currentSort === "new") {

        result.sort(
            (a, b) =>
                new Date(b.publishedAt) -
                new Date(a.publishedAt)
        );

    } else if (currentSort === "old") {

        result.sort(
            (a, b) =>
                new Date(a.publishedAt) -
                new Date(b.publishedAt)
        );

    } else if (currentSort === "short") {

        result.sort(
            (a, b) =>
                a.duration - b.duration
        );

    } else if (currentSort === "long") {

        result.sort(
            (a, b) =>
                b.duration - a.duration
        );
    }
    if (currentSearch !== "") {

        result = result.filter(video =>
            video.title.toLowerCase().includes(
                currentSearch.toLowerCase()
            )
        );
    }

    if(currentYears.length > 0){

        result = result.filter(video => {

            const year =
            video.publishedAt.slice(0,4);

            return currentYears.includes(year);

        });

    }

    displayVideos(result);
}

async function loadVideos() {

    const response =
        await fetch("videos.json");

    videos =
        await response.json();

    currentYears =
    Array.from(
        document.querySelectorAll(
            "#year-dropdown input:checked"
        )
    )
    .map(x => x.value);

    updateYearButton();

    updateDisplay();
}

const sortDropdown =
document.getElementById("sort-dropdown");


const sortButton =
sortDropdown.querySelector(".filter-button");

function setupDropdown(id){

    const dropdown =
    document.getElementById(id);

    const button =
    dropdown.querySelector(".filter-button");

    const menu =
        dropdown.querySelector(".dropdown-menu");

    menu.addEventListener("click", (e) => {

        e.stopPropagation();

    });

    button.onclick = (e) => {

        e.stopPropagation();


        document
        .querySelectorAll(".dropdown")
        .forEach(other => {

            if(other !== dropdown){

                other.classList.remove("active");

            }

        });


        dropdown.classList.toggle("active");

    };
}

setupDropdown("sort-dropdown");
setupDropdown("genre-dropdown");
setupDropdown("duration-dropdown");
setupDropdown("year-dropdown");


sortDropdown
.querySelectorAll(".dropdown-item")
.forEach(item => {


    item.onclick = () => {

        hideIntroduce();

        currentSort =
        item.dataset.value;


        sortButton.innerHTML =
        `
        ${item.textContent}
        <span>▼</span>
        `;


        sortDropdown.classList.remove("active");


        updateDisplay();

    };

});

function updateGenreButton() {

    const button =
        document.querySelector(
            "#genre-dropdown .filter-button"
        );

    if (currentGenres.length === 0) {

        button.innerHTML =
            "ジャンル <span>▼</span>";

    } else if (currentGenres.length <= 2) {

        button.innerHTML =
            currentGenres.join(" / ")
            + " <span>▼</span>";

    } else {

        button.innerHTML =
            `${currentGenres.length}件選択 <span>▼</span>`;
    }
}

function updateDurationButton() {

    const button =
        document.querySelector(
            "#duration-dropdown .filter-button"
        );

    if (currentDurations.length === 0) {

        button.innerHTML =
            "動画時間 <span>▼</span>";

    } else if (currentDurations.length <= 2) {

        button.innerHTML =
            currentDurations
                .map(x => durationLabels[x])
                .join(" / ")
            + " <span>▼</span>";

    } else {

        button.innerHTML =
            `${currentDurations.length}件選択 <span>▼</span>`;
    }
}

function updateYearButton() {

    const button =
        document.querySelector(
            "#year-dropdown .filter-button"
        );

    if(currentYears.length === 9){

        button.innerHTML =
        "投稿年（全期間） <span>▼</span>";

    }
    else if (currentYears.length === 0) {

        button.innerHTML =
            "投稿年 <span>▼</span>";

    } else if (currentYears.length <= 2) {

        button.innerHTML =
            [...currentYears]
            .sort((a,b)=>Number(a)-Number(b))
            .join(" / ")
            + " <span>▼</span>";

    } else {

        button.innerHTML =
            `${currentYears.length}件選択 <span>▼</span>`;
    }
}

document
.querySelectorAll("#genre-dropdown input")
.forEach(box=>{


box.onchange = ()=>{

    hideIntroduce();

    currentGenres =
    Array.from(
        document.querySelectorAll(
            "#genre-dropdown input:checked"
        )
    )
    .map(x=>x.value);

    updateGenreButton();

    updateDisplay();

};


});
document
.querySelectorAll("#duration-dropdown input")
.forEach(box=>{


box.onchange = ()=>{

    hideIntroduce();

    currentDurations =
    Array.from(
        document.querySelectorAll(
            "#duration-dropdown input:checked"
        )
    )
    .map(x=>x.value);

    updateDurationButton();

    updateDisplay();

};


document
.querySelectorAll("#year-dropdown input")
.forEach(box=>{

    box.onchange = ()=>{

        hideIntroduce();

        currentYears =
        Array.from(
            document.querySelectorAll(
                "#year-dropdown input:checked"
            )
        )
        .map(x=>x.value);

        updateYearButton();

        updateDisplay();

    };

});

});

window.addEventListener("load", () => {

    document
    .querySelectorAll(
        "#genre-dropdown input, #duration-dropdown input"
    )
    .forEach(box => {

        box.checked = false;

    });

});

loadVideos();

document
.getElementById("search-button")
.addEventListener("click", function () {

    hideIntroduce();

    currentSearch =
        document.getElementById("search-input").value;

    updateDisplay();
});
document
    .getElementById("search-input")
    .addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            hideIntroduce();

            currentSearch = this.value;
            updateDisplay();

        }
    });
document.addEventListener("click", () => {

    document
        .querySelectorAll(".dropdown")
        .forEach(dropdown => {

            dropdown.classList.remove("active");

        });

});