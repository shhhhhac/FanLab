/* ==================================================
   FanLab Ver.0.4
   script.js
================================================== */


/* ==================================================
   ファンライト条件
================================================== */

const FANLIGHT_RULES = {

    1: {
        A: {
            comments: 50,
            watchMinutes: 180,
            giftPt: 200
        },
        B: {
            comments: 25,
            watchMinutes: 0,
            giftPt: 3000
        }
    },

    2: {
        A: {
            comments: 200,
            watchMinutes: 600,
            giftPt: 1000
        },
        B: {
            comments: 100,
            watchMinutes: 180,
            giftPt: 15000
        }
    },

    3: {
        A: {
            comments: 400,
            watchMinutes: 900,
            giftPt: 10000
        }
    },

    4: {
        A: {
            comments: 800,
            watchMinutes: 1200,
            giftPt: 30000
        }
    },

    5: {
        A: {
            comments: 1200,
            watchMinutes: 1800,
            giftPt: 90000
        }
    }

};


/* ==================================================
   データ
================================================== */

let livers =
    JSON.parse(
        localStorage.getItem("fanlab_livers")
    ) || [];

let schedules =
    JSON.parse(
        localStorage.getItem("fanlab_schedules")
    ) || [];


/* ==================================================
   初期化
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkMonthChange();

        updateDate();

        setupEvents();

        updateHome();

        updateSchedulePage();

    }
);


/* ==================================================
   日付
================================================== */

function updateDate() {

    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();

    const today =
        document.getElementById("today");

    if (today) {

        today.textContent =
            `${year}年${month}月${date}日`;

    }


    const lastDay =
        new Date(
            year,
            month,
            0
        ).getDate();

    const remaining =
        lastDay - date;

    const remainingElement =
        document.getElementById(
            "remainingDays"
        );

    if (remainingElement) {

        remainingElement.textContent =
            remaining;

    }

}


/* ==================================================
   イベント
================================================== */

function setupEvents() {

    /* ---------- menu ---------- */

    const menuButton =
        document.getElementById("menuButton");

    if (menuButton) {
        menuButton.onclick = openMenu;
    }


    const closeMenuButton =
        document.getElementById("closeMenu");

    if (closeMenuButton) {
        closeMenuButton.onclick = closeMenu;
    }


    const menuOverlay =
        document.getElementById("menuOverlay");

    if (menuOverlay) {
        menuOverlay.onclick = closeMenu;
    }


    /* ---------- 五十音インデックス ---------- */

    setupKanaIndex();


    /* ---------- add ---------- */

    const addButton =
        document.getElementById("addButton");

    if (addButton) {

        addButton.onclick = () => {

            const modal =
                document.getElementById("addModal");

            if (modal) {
                modal.classList.add("open");
            }

        };

    }


    const closeAdd =
        document.getElementById("closeAddModal");

    if (closeAdd) {
        closeAdd.onclick = closeAddModal;
    }


    const addModal =
        document.getElementById("addModal");

    if (addModal) {

        addModal.addEventListener(
            "click",
            event => {

                if (
                    event.target.id === "addModal"
                ) {
                    closeAddModal();
                }

            }
        );

    }


    /* ---------- 過去データ ---------- */

    document
        .querySelectorAll("input[name='historyData']")
        .forEach(radio => {

            radio.addEventListener(
                "change",
                () => {

                    const area =
                        document.getElementById(
                            "pastDataArea"
                        );

                    if (!area) return;

                    area.style.display =
                        radio.value === "exist"
                            ? "block"
                            : "none";

                }
            );

        });


    /* ---------- save liver ---------- */

    const saveLiverButton =
        document.getElementById("saveLiver");

    if (saveLiverButton) {
        saveLiverButton.onclick = addLiver;
    }


    /* ---------- save schedule ---------- */

    const saveScheduleButton =
        document.getElementById("saveSchedule");

    if (saveScheduleButton) {
        saveScheduleButton.onclick = addSchedule;
    }


    /* ---------- 並び順 ---------- */

    const liverSort =
        document.getElementById("liverSort");

    if (liverSort) {

        liverSort.addEventListener(
            "change",
            updateHome
        );

    }


    /* ---------- 検索 ---------- */

    const liverSearch =
        document.getElementById("liverSearch");

    if (liverSearch) {

        liverSearch.addEventListener(
            "input",
            updateHome
        );

    }


    /* ---------- show all ---------- */

    const showAll =
        document.getElementById("showAllLivers");

    if (showAll) {

        showAll.onclick = () => {

            const section =
                document.getElementById(
                    "allLiverSection"
                );

            if (!section) return;

            section.scrollIntoView({
                behavior: "smooth"
            });

        };

    }


    /* ---------- achievement close ---------- */

    const closeAchievementButton =
        document.getElementById(
            "closeAchievement"
        );

    if (closeAchievementButton) {
        closeAchievementButton.onclick =
            closeAchievement;
    }


    const achievementOverlay =
        document.getElementById(
            "achievementOverlay"
        );

    if (achievementOverlay) {

        achievementOverlay.onclick =
            event => {

                if (
                    event.target.id ===
                    "achievementOverlay"
                ) {
                    closeAchievement();
                }

            };

    }


    /* ---------- ヘッダー検索 ---------- */

    setupHeaderSearch();

}


/* ==================================================
   MENU
================================================== */

function openMenu() {

    const sideMenu =
        document.getElementById(
            "sideMenu"
        );

    const overlay =
        document.getElementById(
            "menuOverlay"
        );


    if (sideMenu) {

        sideMenu.classList.add(
            "open"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "open"
        );

    }

}


function closeMenu() {

    const sideMenu =
        document.getElementById(
            "sideMenu"
        );

    const overlay =
        document.getElementById(
            "menuOverlay"
        );


    if (sideMenu) {

        sideMenu.classList.remove(
            "open"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "open"
        );

    }

}


/* ==================================================
   ページ切替
================================================== */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add(
                "hidden"
            );

        });


    const target =
        document.getElementById(
            pageId
        );

    if (!target) return;


    target.classList.remove(
        "hidden"
    );


    const header =
        document.querySelector(
            "header"
        );

    if (header) {

        header.style.display =
            "flex";

    }


    if (pageId === "schedulePage") {

        updateSchedulePage();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ==================================================
   MODAL
================================================== */

function closeAddModal() {

    const modal =
        document.getElementById(
            "addModal"
        );

    if (!modal) return;

    modal.classList.remove(
        "open"
    );

}


/* ==================================================
   ライバー追加
================================================== */

function addLiver() {

    const nameInput =
        document.getElementById(
            "liverName"
        );

const kanaInput =
    document.getElementById(
        "liverKana"
    );

    if (!nameInput) return;


    const name =
        nameInput.value.trim();

const kana =
    kanaInput
    ? kanaInput.value.trim()
    : "";


if (!name || !kana) {
    alert(
        "名前とよみがなを入力してください"
    );
    return;
}

const myLiverElement =
        document.getElementById(
            "myLiverCheck"
        );


    const myLiver =
        myLiverElement
        ? myLiverElement.checked
        : false;


    const historyRadio =
        document.querySelector(
            "input[name='historyData']:checked"
        );


    const hasHistory =
        historyRadio
        ? historyRadio.value
        : "none";


    const levelHistory = {};


    for (let i = 1; i <= 5; i++) {

        const streakElement =
            document.getElementById(
                `lv${i}Streak`
            );

        const countElement =
            document.getElementById(
                `lv${i}Count`
            );


        levelHistory["lv" + i] = {

            streak:
                hasHistory === "exist" &&
                streakElement
                ? Number(
                    streakElement.value
                )
                : 0,

            count:
                hasHistory === "exist" &&
                countElement
                ? Number(
                    countElement.value
                )
                : 0

        };

    }


    const currentLevelElement =
        document.getElementById(
            "currentLevel"
        );


    const iconInput =
        document.getElementById(
            "liverIcon"
        );


    const createLiver =
        iconData => {

            const initialLevel =
                hasHistory === "exist" &&
                currentLevelElement
                ? Number(
                    currentLevelElement.value
                )
                : 0;
const liver = {

    id:
        Date.now(),

name:
    name,

kana:
    kana,

icon:
    iconData,

    myLiver:
        myLiver,

    favorite:
        myLiver,

    level:
        initialLevel,

    levelHistory:
        levelHistory,

    currentMonth: {

        comments: 0,

        watchMinutes: 0,

        giftPt: 0

    },

    schedules: [],

    fanlightHistory: [],

    recordHistory: [],

    monthlyArchive: [],

    timerStart: null,

    selectedCondition: "A"

};

            livers.push(liver);

            saveData();

            updateHome();

            updateSchedulePage();

            closeAddModal();

            resetLiverForm();

        };


    if (
        iconInput &&
        iconInput.files &&
        iconInput.files[0]
    ) {

        const reader =
            new FileReader();


        reader.onload =
            event => {

                createLiver(
                    event.target.result
                );

            };


        reader.readAsDataURL(
            iconInput.files[0]
        );

    } else {

        createLiver("");

    }

}


/* ==================================================
   フォームリセット
================================================== */

function resetLiverForm() {

    const name =
        document.getElementById(
            "liverName"
        );

    if (name) {

        name.value = "";

    }

const kana =
    document.getElementById(
        "liverKana"
    );

if (kana) {

    kana.value = "";

}

    const icon =
        document.getElementById(
            "liverIcon"
        );

    if (icon) {

        icon.value = "";

    }


    const myLiver =
        document.getElementById(
            "myLiverCheck"
        );

    if (myLiver) {

        myLiver.checked = false;

    }


    const noneRadio =
        document.querySelector(
            "input[name='historyData'][value='none']"
        );

    if (noneRadio) {

        noneRadio.checked = true;

    }


    const pastData =
        document.getElementById(
            "pastDataArea"
        );

    if (pastData) {

        pastData.style.display =
            "none";

    }

}


/* ==================================================
   保存
================================================== */

function saveData() {

    localStorage.setItem(
        "fanlab_livers",
        JSON.stringify(livers)
    );

    localStorage.setItem(
        "fanlab_schedules",
        JSON.stringify(schedules)
    );

}


/* ==================================================
   ホーム更新
================================================== */

function updateHome() {

    const myArea =
        document.getElementById("myLiverArea");

    const liverArea =
        document.getElementById("liverArea");


    /* ==================================================
       MYライバー
    ================================================== */

    const myLivers =
        sortLiversByKana(
            livers.filter(
                liver => liver.myLiver
            )
        );


    if (myArea) {

        myArea.innerHTML = "";

        if (myLivers.length === 0) {

            myArea.innerHTML = `
                <div class="empty-card glass">
                    MYライバーを登録しましょう
                </div>
            `;

        } else {

            myLivers.forEach(liver => {

                myArea.innerHTML +=
                    createCard(liver);

            });

        }

    }


    /* ==================================================
       全ライバー
    ================================================== */

    if (liverArea) {

        liverArea.innerHTML = "";


        if (livers.length === 0) {

            liverArea.innerHTML = `
                <div class="empty-card glass">
                    ライバーが登録されていません
                </div>
            `;

        } else {

/* ---------- 検索 ---------- */
const searchInput =
    document.getElementById("headerSearch") ||
    document.getElementById("menuSearch");
const searchWord =
    searchInput
        ? normalizeSearchText(searchInput.value)
        : "";
let sortedLivers =
    [...livers];
if (searchWord) {
    sortedLivers =
        sortedLivers.filter(
            liver => {
                const name =
                    normalizeSearchText(
                        liver.name
                    );
                const kana =
                    normalizeSearchText(
                        liver.kana
                    );
                return (
                    name.includes(searchWord) ||
                    kana.includes(searchWord)
                );
            }
        );
}
            /* ---------- 検索結果なし ---------- */

            if (
                searchWord &&
                sortedLivers.length === 0
            ) {

                liverArea.innerHTML = `
                    <div class="empty-card glass">
                        「${escapeHTML(searchWord)}」に
                        一致するライバーはいません
                    </div>
                `;

                updateKanaIndex();

                updateHomeSchedule();

                return;

            }


            /* ---------- 並び順 ---------- */

            const liverSort =
                document.getElementById(
                    "liverSort"
                );

            const sortType =
                liverSort
                    ? liverSort.value
                    : "kana";


            if (sortType === "kana") {

                sortedLivers =
                    sortLiversByKana(
                        sortedLivers
                    );

            }

            else if (
                sortType === "newest"
            ) {

                sortedLivers.sort(
                    (a, b) =>
                        Number(b.id || 0) -
                        Number(a.id || 0)
                );

            }

            else if (
                sortType === "lv1streak"
            ) {

                sortedLivers.sort(
                    (a, b) => {

                        const streakA =
                            Number(
                                a.levelHistory
                                    ?.lv1
                                    ?.streak || 0
                            );

                        const streakB =
                            Number(
                                b.levelHistory
                                    ?.lv1
                                    ?.streak || 0
                            );

                        return streakB - streakA;

                    }
                );

            }


            /* ---------- カード表示 ---------- */

            if (sortType === "kana") {

                let currentGroup = "";


                sortedLivers.forEach(
                    liver => {

                        const group =
                            getKanaGroup(
                                liver.kana
                            );


                        if (
                            group !==
                            currentGroup
                        ) {

                            liverArea.innerHTML += `
                                <div
                                    class="kana-section-title"
                                    data-kana="${group}">
                                    ${group}行
                                </div>
                            `;

                            currentGroup =
                                group;

                        }


                        liverArea.innerHTML +=
                            createCard(liver);

                    }
                );


            } else {

                sortedLivers.forEach(
                    liver => {

                        liverArea.innerHTML +=
                            createCard(liver);

                    }
                );

            }

        }

    }


    /* ==================================================
       五十音インデックスを再設定
    ================================================== */

    updateKanaIndex();


    /* ==================================================
       配信予定
    ================================================== */

    updateHomeSchedule();

}

/* ==================================================
   カード
================================================== */

function createCard(liver) {

    const level =
        Number(liver.level || 0);


    const history =
        liver.levelHistory?.[
            "lv" + level
        ] || {
            streak: 0,
            count: 0
        };


    /*
     * メーターは
     * 「次に目指している条件」ではなく
     * 現在取得しているファンライトLvの色
     * を使う。
     */

    const meterLevel =
        Math.max(
            0,
            Math.min(
                5,
                level
            )
        );


    return `

        <div
            class="liver-card level-${level}"
            onclick="openDetail(${liver.id})">

            <div class="liver-icon">

                ${
                    liver.icon
                    ? `<img src="${liver.icon}">`
                    : "🌿"
                }

            </div>


            <div class="liver-info">

                <div class="liver-name">
                    ${escapeHTML(liver.name)}
                </div>


                <div class="liver-status">

                    <span>
                        🔥${history.streak}ヶ月連続
                    </span>

                    <span>
                        🏆${history.count}回目
                    </span>

                </div>


                <div
                    class="liver-meter level-meter-${meterLevel}">

                    <div
                        class="liver-meter-fill"
                        style="width:100%;">
                    </div>

                </div>

            </div>


            <div class="liver-level">

                ${
                    level === 0
                    ? "未取得"
                    : `ファンラ Lv${level}`
                }

            </div>

        </div>

    `;

}


/* ==================================================
   詳細
================================================== */

function openDetail(id) {

    const liver =
        livers.find(
            item =>
                item.id === id
        );


    if (!liver) return;


    showPage("detail");

    renderDetail(liver);

}


function renderDetail(liver) {

    if (!liver) return;


    if (!liver.currentMonth) {

        liver.currentMonth = {

            comments: 0,

            watchMinutes: 0,

            giftPt: 0

        };

    }


    const month =
        liver.currentMonth;


const currentLevel =
    Number(
        liver.level || 0
    );


/*
 * 現在の最高レベル
 * = 実際に達成している最高Lv
 */

const highestLevel =
    currentLevel;


/*
 * プルダウンで見るLv
 * = 連続記録・進捗を見るためだけ
 */

const viewLevel =
    liver.viewLevel !== undefined
    ? Number(liver.viewLevel)
    : currentLevel;


const nextLevel =
    Math.min(
        currentLevel + 1,
        5
    );


const levelHistory =
    liver.levelHistory?.[
        "lv" + viewLevel
    ] || {
        streak: 0,
        count: 0
    };


    const nextRule =
        FANLIGHT_RULES[nextLevel];


    let selectedCondition =
        liver.selectedCondition ||
        "A";


    if (
        nextRule &&
        !nextRule.B &&
        selectedCondition === "B"
    ) {

        selectedCondition = "A";

    }


    liver.selectedCondition =
        selectedCondition;


    const rule =
        nextRule
        ? nextRule[selectedCondition]
        : null;


    const schedule =
        getNextSchedule(liver);


    const detail =
        document.getElementById(
            "detailContent"
        );


    if (!detail) return;


    detail.innerHTML = `

        <div class="detail-profile">

            <div class="detail-icon">

                ${
                    liver.icon
                    ? `<img src="${liver.icon}">`
                    : "🌿"
                }

            </div>


            <div class="detail-name">
                ${escapeHTML(liver.name)}
            </div>


            <button
                class="favorite-button"
                onclick="toggleFavorite(${liver.id})">

                ${
                    liver.favorite
                    ? "⭐"
                    : "☆"
                }

            </button>

        </div>

<button
    type="button"
    class="edit-profile-button"
    onclick="openLiverEdit(${liver.id})"
    aria-label="ライバー情報を編集">

    ✎

</button>

        <div class="detail-glass glass">

            <div class="level-switch-title">
                現在のファンライト
            </div>


            <div class="current-highest-level">

                現在の最高レベル：
                <strong>
                    ${
                        highestLevel === 0
                        ? "未取得"
                        : `Lv${highestLevel}`
                    }
                </strong>

            </div>


            <select
                class="level-select"
                id="currentLevelSelect">

<option
    value="0"
    ${viewLevel === 0 ? "selected" : ""}>
                    未取得

                </option>


                <option
                    value="1"
                    ${viewLevel === 1 ? "selected" : ""}>

                    Lv1

                </option>


                <option
                    value="2"
                    ${viewLevel === 2 ? "selected" : ""}>

                    Lv2

                </option>


                <option
                    value="3"
                    ${viewLevel === 3 ? "selected" : ""}>

                    Lv3

                </option>


                <option
                    value="4"
                    ${viewLevel === 4 ? "selected" : ""}>

                    Lv4

                </option>


                <option
                    value="5"
                    ${viewLevel === 5 ? "selected" : ""}>

                    Lv5

                </option>

            </select>


            <div class="detail-status">

                <span>
                    🔥${levelHistory.streak}ヶ月連続
                </span>

                <span>
                    🏆${levelHistory.count}回目
                </span>

            </div>

        </div>


        <div class="detail-glass glass">

            <div class="next-schedule">

                <strong>📅 次回配信</strong>

                ${
                    schedule
                    ? `
                        <div class="schedule-date">
                            ${formatDateTime(schedule.date)}
                        </div>

                        ${
                            schedule.memo
                            ? `
                                <div class="schedule-memo">
                                    ${escapeHTML(schedule.memo)}
                                </div>
                            `
                            : ""
                        }
                    `
                    : `
                        <div class="schedule-memo">
                            配信予定なし
                        </div>
                    `
                }

            </div>

        </div>


        ${
            currentLevel >= 5

            ? `

                <div class="detail-glass glass">

                    <div class="section-title">

                        <h2>
                            ✨ Lv5達成済み
                        </h2>

                    </div>


                    <p class="condition-note">

                        今月の記録は保存されています。

                    </p>

                </div>

            `

            : `

                <div class="detail-glass glass">

                    <div class="level-switch-title">

                        次のファンライト

                    </div>


                    <div class="next-level-switch">

                        ${
                            nextRule &&
                            nextRule.B
                            ? `

                                <button
                                    class="condition-switch ${
                                        selectedCondition === "A"
                                        ? "active"
                                        : ""
                                    }"
                                    onclick="changeCondition(${liver.id}, 'A')">

                                    条件A

                                </button>


                                <button
                                    class="condition-switch ${
                                        selectedCondition === "B"
                                        ? "active"
                                        : ""
                                    }"
                                    onclick="changeCondition(${liver.id}, 'B')">

                                    条件B

                                </button>

                            `
                            : ""
                        }

                    </div>


                    <div class="condition-note">

                        Lv${nextLevel}

                        ${
                            nextRule &&
                            nextRule.B
                            ? "はAまたはBのどちらか達成で取得"
                            : "の条件"
                        }

                    </div>


                    ${
                        rule
                        ? `

                            <div class="progress-row">

                                <div class="progress-label">
                                    💬 コメント
                                </div>

                                <div class="progress-bar">

                                    <div
                                        class="progress-fill"
                                        style="
                                            width:
                                            ${progressPercent(
                                                month.comments,
                                                rule.comments
                                            )}%
                                        ">
                                    </div>

                                    <div class="progress-text">

                                        ${month.comments}
                                        /
                                        ${rule.comments}

                                    </div>

                                </div>

                            </div>


                            <div class="progress-row">

                                <div class="progress-label">
                                    ⏱ 視聴時間
                                </div>

                                <div class="progress-bar">

                                    <div
                                        class="progress-fill"
                                        style="
                                            width:
                                            ${progressPercent(
                                                month.watchMinutes,
                                                rule.watchMinutes
                                            )}%
                                        ">
                                    </div>

                                    <div class="progress-text">

                                        ${formatWatchTime(
                                            month.watchMinutes
                                        )}

                                        /

                                        ${
                                            rule.watchMinutes === 0
                                            ? "条件なし"
                                            : formatWatchTime(
                                                rule.watchMinutes
                                            )
                                        }

                                    </div>

                                </div>

                            </div>


                            <div class="progress-row">

                                <div class="progress-label">
                                    🎁 ギフトpt
                                </div>

                                <div class="progress-bar">

                                    <div
                                        class="progress-fill"
                                        style="
                                            width:
                                            ${progressPercent(
                                                month.giftPt,
                                                rule.giftPt
                                            )}%
                                        ">
                                    </div>

                                    <div class="progress-text">

                                        ${month.giftPt}
                                        /
                                        ${rule.giftPt}pt

                                    </div>

                                </div>

                            </div>

                        `
                        : ""
                    }

                </div>

            `
        }


        <div class="detail-glass glass">

            <div class="timer-status">

                ${
                    liver.timerStart
                    ? "🟢 視聴中"
                    : "⚪ 待機中"
                }

            </div>


            <button
                type="button"
                class="detail-button start-button"
                onclick="startWatching(${liver.id})">

                🟢 START

            </button>


            <button
                type="button"
                class="detail-button end-button"
                onclick="endWatching(${liver.id})">

                🔴 END

            </button>

        </div>


        <div class="detail-glass glass">

            <div
                class="edit-toggle"
                onclick="toggleEdit()">

                <span>
                    ▼ 編集
                </span>

                <span id="editArrow">
                    ＋
                </span>

            </div>


            <div
                id="editContent"
                class="edit-content">


                <div class="edit-group">

                    <label>
                        コメント
                    </label>


                    <div class="edit-current">

                        現在：
                        ${month.comments}コメント

                    </div>


                    <input
                        class="edit-input"
                        type="number"
                        id="editComments"
                        value="${month.comments}"
                        min="0">

                </div>


                <div class="edit-group">

                    <label>
                        視聴時間
                    </label>


                    <div class="edit-current">

                        現在：
                        ${formatWatchTime(
                            month.watchMinutes
                        )}

                    </div>


                    <div class="edit-subtitle">

                        今日の視聴分を追加

                    </div>


                    <div class="time-inputs">

                        <input
                            class="edit-input"
                            type="number"
                            id="addHour"
                            placeholder="時間"
                            min="0">


                        <input
                            class="edit-input"
                            type="number"
                            id="addMinute"
                            placeholder="分"
                            min="0">

                    </div>


                    <div
    class="edit-toggle edit-sub-toggle"
    onclick="toggleWatchCorrection()">
    <span>
        ▶ 累計を修正
    </span>
    <span id="watchCorrectionArrow">
        ＋
    </span>
</div>
<div
    id="watchCorrectionArea"
    class="correction-area">
    <div class="edit-subtitle">
        修正後の累計時間を入力
    </div>
    <div class="time-inputs">
        <input
            class="edit-input"
            type="number"
            id="editWatchHours"
            placeholder="時間"
            min="0">
        <input
            class="edit-input"
            type="number"
            id="editWatchMinutes"
            placeholder="分"
            min="0"
            max="59">
    </div>
</div>
                </div>


                <div class="edit-group">

                    <label>
                        ギフトpt
                    </label>


                    <div class="edit-current">

                        現在：
                        ${month.giftPt}pt

                    </div>


                    <div class="edit-subtitle">

                        追加pt

                    </div>


                    <input
                        class="edit-input"
                        type="number"
                        id="addGift"
                        placeholder="追加pt"
                        min="0">


                   <div
    class="edit-toggle edit-sub-toggle"
    onclick="toggleGiftCorrection()">

    <span>
        ▶ 累計を修正
    </span>

    <span id="giftCorrectionArrow">
        ＋
    </span>

</div>


<div
    id="giftCorrectionArea"
    class="correction-area">

    <div class="edit-subtitle">
        修正後の累計ptを入力
    </div>

    <input
        class="edit-input"
        type="number"
        id="editGiftPt"
        placeholder="累計pt"
        min="0">

</div>
</div>

                <button
                    type="button"
                    class="detail-button"
                    onclick="saveEdit(${liver.id})">

                    保存

                </button>

            </div>

        </div>


        <div class="detail-glass glass">

            <div
                class="edit-toggle"
                onclick="toggleRecordHistory()">

                <span>
                    ▶ 記録編集履歴
                </span>

                <span>
                    ＋
                </span>

            </div>


            <div
                id="recordHistoryContent"
                class="edit-content">

                ${createRecordHistory(liver)}

            </div>

        </div>


        <div class="detail-glass glass">

            <div
                class="edit-toggle"
                onclick="toggleFanlightHistory()">

                <span>
                    ▶ ファンライト履歴
                </span>

                <span>
                    ＋
                </span>

            </div>


            <div
                id="fanlightHistoryContent"
                class="edit-content">

                ${createFanlightHistory(liver)}

            </div>

        </div>


        <div class="detail-glass glass danger-zone">

            <button
                type="button"
                class="delete-liver-button"
                onclick="deleteLiver(${liver.id})">

                ライバーを削除

            </button>

        </div>

    `;


    const backHome =
        document.getElementById(
            "backHome"
        );


    if (backHome) {

        backHome.onclick = () => {

            showPage("homePage");

        };

    }


const levelSelect =
    document.getElementById(
        "currentLevelSelect"
    );


if (levelSelect) {

    levelSelect.onchange =
        event => {

            const newLevel =
                Number(
                    event.target.value
                );


            /*
             * 手動変更は
             * 「見るレベル」の変更として扱う。
             *
             * liver.level は
             * 現在の最高レベルなので変更しない。
             */

            liver.viewLevel =
                newLevel;


            saveData();

            renderDetail(liver);

        };

}
}

/* ==================================================
   累計修正表示切替
================================================== */

function toggleGiftCorrection() {

    const area =
        document.getElementById(
            "giftCorrectionArea"
        );

    const arrow =
        document.getElementById(
            "giftCorrectionArrow"
        );

    if (!area) return;

    area.classList.toggle("open");

    if (arrow) {

        arrow.textContent =
            area.classList.contains("open")
            ? "−"
            : "＋";

    }

}

function toggleWatchCorrection() {
    const area =
        document.getElementById(
            "watchCorrectionArea"
        );
    const arrow =
        document.getElementById(
            "watchCorrectionArrow"
        );
    if (!area) return;
    area.classList.toggle("open");
    if (arrow) {
        arrow.textContent =
            area.classList.contains("open")
            ? "−"
            : "＋";
    }
}


/* ==================================================
   ライバー削除
================================================== */

function deleteLiver(id) {

    const liver =
        livers.find(
            item =>
                item.id === id
        );


    if (!liver) return;


    const confirmed =
        confirm(
            `「${liver.name}」を削除しますか？\n\nこのライバーの記録・履歴も削除されます。`
        );


    if (!confirmed) return;


    livers =
        livers.filter(
            item =>
                item.id !== id
        );


    schedules =
        schedules.filter(
            item =>
                item.liverId !== id
        );


    saveData();

    updateHome();

    updateSchedulePage();

    showPage("homePage");

}


/* ==================================================
   条件切替
================================================== */

function changeCondition(
    id,
    condition
) {

    const liver =
        livers.find(
            item =>
                item.id === id
        );


    if (!liver) return;


    liver.selectedCondition =
        condition;


    saveData();

    renderDetail(liver);

}


/* ==================================================
   条件達成判定
================================================== */

function conditionAchieved(
    month,
    rule
) {

    if (!rule) return false;


    const commentsOK =
        month.comments >=
        rule.comments;


    const watchOK =
        rule.watchMinutes === 0 ||
        month.watchMinutes >=
        rule.watchMinutes;


    const giftOK =
        month.giftPt >=
        rule.giftPt;


    return (
        commentsOK &&
        watchOK &&
        giftOK
    );

}


function levelAchieved(
    month,
    level
) {

    const rule =
        FANLIGHT_RULES[level];


    if (!rule) return false;


    if (rule.B) {

        /*
         * A または B
         */

        return (
            conditionAchieved(
                month,
                rule.A
            ) ||
            conditionAchieved(
                month,
                rule.B
            )
        );

    }


    return conditionAchieved(
        month,
        rule.A
    );

}


/* ==================================================
   ファンライト取得確認
================================================== */

function checkAchievements(liver) {

    if (!liver) return;


    if (
        Number(liver.level || 0) >= 5
    ) {

        return;

    }


    const oldLevel =
        Number(
            liver.level || 0
        );


    let highest =
        oldLevel;


    for (
        let level =
            oldLevel + 1;

        level <= 5;

        level++
    ) {

        if (
            levelAchieved(
                liver.currentMonth,
                level
            )
        ) {

            highest =
                level;

        } else {

            break;

        }

    }


    if (
        highest <= oldLevel
    ) {

        return;

    }


    const today =
        getDateKey();


    const achievedLevels = [];


    for (
        let level =
            oldLevel + 1;

        level <= highest;

        level++
    ) {

        const result =
            registerAchievement(
                liver,
                level,
                today
            );


        if (result) {

            achievedLevels.push(
                result
            );

        }

    }


    liver.level =
        highest;


    saveData();

    updateHome();


    /*
     * 飛び級でも最後に取得したLvを演出
     */

    if (
        achievedLevels.length > 0
    ) {

        showAchievement(
            liver,
            achievedLevels[
                achievedLevels.length - 1
            ]
        );

    }

}


/* ==================================================
   取得登録
================================================== */

function registerAchievement(
    liver,
    level,
    date
) {

    if (!liver.levelHistory) {

        liver.levelHistory = {};

    }


    if (
        !liver.levelHistory[
            "lv" + level
        ]
    ) {

        liver.levelHistory[
            "lv" + level
        ] = {

            streak: 0,

            count: 0

        };

    }


    const history =
        liver.levelHistory[
            "lv" + level
        ];


    const already =
        liver.fanlightHistory?.some(
            item =>
                item.date === date &&
                item.level === level
        );


    if (already) {

        return null;

    }


    history.count =
        Number(
            history.count || 0
        ) + 1;


    history.streak =
        Math.max(
            1,
            Number(
                history.streak || 0
            )
        );


    if (
        !liver.fanlightHistory
    ) {

        liver.fanlightHistory =
            [];

    }


    liver.fanlightHistory.push({

        id:
            Date.now() +
            Math.random(),

        date:
            date,

        level:
            level,

        month:
            date.slice(
                0,
                7
            )

    });


    return {

        level:
            level,

        streak:
            history.streak,

        count:
            history.count

    };

}


/* ==================================================
   取得演出
================================================== */

function showAchievement(
    liver,
    achievement
) {

    const overlay =
        document.getElementById(
            "achievementOverlay"
        );


    if (!overlay) return;


    const icon =
        document.getElementById(
            "achievementIcon"
        );


    if (icon) {

        icon.innerHTML =
            liver.icon
            ? `<img src="${liver.icon}">`
            : "🌿";

    }


    const name =
        document.getElementById(
            "achievementName"
        );


    if (name) {

        name.textContent =
            liver.name;

    }


    const level =
        document.getElementById(
            "achievementLevel"
        );


    if (level) {

        level.textContent =
            `Lv${achievement.level}`;

    }


    const stats =
        document.getElementById(
            "achievementStats"
        );


    if (stats) {

        stats.textContent =
            `🔥${achievement.streak}ヶ月連続　🏆${achievement.count}回目`;

    }


    overlay.classList.add(
        "show"
    );

}


function closeAchievement() {

    const overlay =
        document.getElementById(
            "achievementOverlay"
        );


    if (!overlay) return;


    overlay.classList.remove(
        "show"
    );

}


/* ==================================================
   FAVORITE
================================================== */

function toggleFavorite(id) {

    const liver =
        livers.find(
            item =>
                item.id === id
        );


    if (!liver) return;


    const newValue =
        !liver.favorite;


    liver.favorite =
        newValue;


    /*
     * MYライバー登録とお気に入りは同じもの
     */

    liver.myLiver =
        newValue;


    saveData();

    updateHome();

    renderDetail(liver);

}


/* ==================================================
   START
================================================== */

function startWatching(id) {

    const liver =
        livers.find(
            item =>
                item.id === id
        );


    if (!liver) return;


    if (liver.timerStart) {

        alert(
            "すでにSTARTしています"
        );

        return;

    }


    liver.timerStart =
        Date.now();


    saveData();

    renderDetail(liver);

}


/* ==================================================
   END
================================================== */

function endWatching(id) {

    const liver =
        livers.find(
            item =>
                item.id === id
        );


    if (!liver) return;


    if (!liver.timerStart) {

        alert(
            "STARTされていません"
        );

        return;

    }


    const startTime =
        Number(
            liver.timerStart
        );


    const elapsed =
        Math.max(
            0,
            Math.floor(
                (
                    Date.now() -
                    startTime
                ) / 60000
            )
        );


    if (!liver.currentMonth) {

        liver.currentMonth = {

            comments: 0,

            watchMinutes: 0,

            giftPt: 0

        };

    }


    liver.currentMonth.watchMinutes +=
        elapsed;


    addRecordHistory(
        liver,
        `視聴時間 +${elapsed}分`
    );


    liver.timerStart =
        null;


    saveData();

    checkAchievements(liver);

    renderDetail(liver);

    updateHome();

}


/* ==================================================
   編集保存
================================================== */

function saveEdit(id) {

    const liver =
        livers.find(
            item =>
                item.id === id
        );


    if (!liver) return;


    const month =
        liver.currentMonth;


    const oldComments =
        Number(
            month.comments || 0
        );


    const oldWatch =
        Number(
            month.watchMinutes || 0
        );


    const oldGift =
        Number(
            month.giftPt || 0
        );


    const commentsElement =
        document.getElementById(
            "editComments"
        );


    const comments =
        commentsElement
        ? Number(
            commentsElement.value
        )
        : oldComments;


    const addHourElement =
        document.getElementById(
            "addHour"
        );


    const addMinuteElement =
        document.getElementById(
            "addMinute"
        );


    const addHour =
        addHourElement
        ? Number(
            addHourElement.value
        ) || 0
        : 0;


    const addMinute =
        addMinuteElement
        ? Number(
            addMinuteElement.value
        ) || 0
        : 0;


const watchCorrectionHoursElement =
    document.getElementById(
        "editWatchHours"
    );


const watchCorrectionMinutesElement =
    document.getElementById(
        "editWatchMinutes"
    );


const watchCorrectionHours =
    watchCorrectionHoursElement
    ? Number(
        watchCorrectionHoursElement.value
    ) || 0
    : 0;


const watchCorrectionMinutes =
    watchCorrectionMinutesElement
    ? Number(
        watchCorrectionMinutesElement.value
    ) || 0
    : 0;


const hasWatchCorrection =
    watchCorrectionHoursElement &&
    watchCorrectionMinutesElement &&
    (
        watchCorrectionHoursElement.value !== "" ||
        watchCorrectionMinutesElement.value !== ""
    );

    const addGiftElement =
        document.getElementById(
            "addGift"
        );


    const addGift =
        addGiftElement
        ? Number(
            addGiftElement.value
        ) || 0
        : 0;


    const giftCorrectionElement =
        document.getElementById(
            "editGiftPt"
        );


    const giftCorrection =
        giftCorrectionElement
        ? giftCorrectionElement.value
        : "";


    month.comments =
        Math.max(
            0,
            comments
        );


    /*
     * 視聴時間
     */

if (
    hasWatchCorrection
) {

    month.watchMinutes =
        Math.max(
            0,
            watchCorrectionHours * 60 +
            watchCorrectionMinutes
        );


} else {

        const addedMinutes =
            addHour * 60 +
            addMinute;


        if (
            addedMinutes > 0
        ) {

            month.watchMinutes +=
                addedMinutes;


            addRecordHistory(
                liver,
                `視聴時間 +${addedMinutes}分`
            );

        }

    }


    /*
     * ギフト
     */

    if (
        giftCorrection !== ""
    ) {

        month.giftPt =
            Math.max(
                0,
                Number(
                    giftCorrection
                )
            );


    } else {

        if (
            addGift > 0
        ) {

            month.giftPt +=
                addGift;


            addRecordHistory(
                liver,
                `ギフトpt +${addGift}pt`
            );

        }

    }


    /*
     * コメント変更履歴
     */

    if (
        oldComments !==
        month.comments
    ) {

        addRecordHistory(
            liver,
            `コメント ${oldComments} → ${month.comments}`
        );

    }


    /*
     * 視聴時間を累計修正した場合
     */

if (
    hasWatchCorrection &&
    oldWatch !==
    month.watchMinutes
) {

    addRecordHistory(
        liver,
        `視聴時間 ${oldWatch}分 → ${month.watchMinutes}分`
    );

}


    /*
     * ギフトを累計修正した場合
     */

    if (
        giftCorrection !== "" &&
        oldGift !==
        month.giftPt
    ) {

        addRecordHistory(
            liver,
            `ギフトpt ${oldGift}pt → ${month.giftPt}pt`
        );

    }


    saveData();

    checkAchievements(liver);

    renderDetail(liver);

    updateHome();

}


/* ==================================================
   記録履歴
================================================== */

function addRecordHistory(
    liver,
    text
) {

    if (
        !liver.recordHistory
    ) {

        liver.recordHistory =
            [];

    }


    liver.recordHistory.unshift({

        dateTime:
            new Date().toISOString(),

        text:
            text

    });


    liver.recordHistory =
        liver.recordHistory.slice(
            0,
            100
        );

}


function createRecordHistory(
    liver
) {

    if (
        !liver.recordHistory ||
        liver.recordHistory.length === 0
    ) {

        return `
            <div class="empty-card">
                まだ記録編集履歴はありません
            </div>
        `;

    }


    return `

        <div class="record-history">

            ${
                liver.recordHistory
                    .map(item => {

                        const date =
                            new Date(
                                item.dateTime
                            );


                        return `

                            <div
                                class="record-history-item">

                                <span>
                                    ${escapeHTML(
                                        item.text
                                    )}
                                </span>


                                <span
                                    class="record-history-time">

                                    ${formatHistoryDate(
                                        date
                                    )}

                                </span>

                            </div>

                        `;

                    })
                    .join("")
            }

        </div>

    `;

}


/* ==================================================
   ファンライト履歴
================================================== */

function createFanlightHistory(
    liver
) {

    const history =
        liver.fanlightHistory ||
        [];


    if (
        history.length === 0
    ) {

        return `
            <div class="empty-card">
                まだファンライト取得履歴はありません
            </div>
        `;

    }


    const months = {};


    history.forEach(
        item => {

            if (
                !months[item.month]
            ) {

                months[item.month] =
                    [];

            }


            months[item.month].push(
                item
            );

        }
    );


    const sortedMonths =
        Object.keys(months)
            .sort()
            .reverse();


    return sortedMonths
        .map(
            month => {

                const levels =
                    months[month]
                        .sort(
                            (a, b) =>
                                a.level -
                                b.level
                        );


                return `

                    <div class="history-month">

                        <div
                            class="history-month-title">

                            ${formatMonth(
                                month
                            )}

                        </div>


                        ${
                            levels
                                .map(
                                    item => `

                                        <div
                                            class="history-level">

                                            <span>

                                                Lv${item.level}

                                            </span>


                                            <span
                                                class="history-date">

                                                ${formatHistoryShort(
                                                    item.date
                                                )}

                                                取得

                                            </span>

                                        </div>

                                    `
                                )
                                .join("")
                        }

                    </div>

                `;

            }
        )
        .join("");

}


/* ==================================================
   ACCORDION
================================================== */

function toggleEdit() {

    const content =
        document.getElementById(
            "editContent"
        );


    const arrow =
        document.getElementById(
            "editArrow"
        );


    if (!content) return;


    content.classList.toggle(
        "open"
    );


    if (arrow) {

        arrow.textContent =
            content.classList.contains(
                "open"
            )
            ? "−"
            : "＋";

    }

}


function toggleRecordHistory() {

    const content =
        document.getElementById(
            "recordHistoryContent"
        );


    if (!content) return;


    content.classList.toggle(
        "open"
    );

}


function toggleFanlightHistory() {

    const content =
        document.getElementById(
            "fanlightHistoryContent"
        );


    if (!content) return;


    content.classList.toggle(
        "open"
    );

}


/* ==================================================
   SCHEDULE
================================================== */

function addSchedule() {

    const liverSelect =
        document.getElementById(
            "scheduleLiverSelect"
        );


    const dateElement =
        document.getElementById(
            "scheduleDate"
        );


    const memoElement =
        document.getElementById(
            "scheduleMemo"
        );


    if (
        !liverSelect ||
        !dateElement
    ) {

        return;

    }


    const liverId =
        Number(
            liverSelect.value
        );


    const date =
        dateElement.value;


    const memo =
        memoElement
        ? memoElement.value.trim()
        : "";


    if (
        !liverId ||
        !date
    ) {

        alert(
            "ライバーと日時を入力してください"
        );

        return;

    }


    schedules.push({

        id:
            Date.now(),

        liverId:
            liverId,

        date:
            date,

        memo:
            memo

    });


    saveData();


    dateElement.value =
        "";


    if (memoElement) {

        memoElement.value =
            "";

    }


    updateSchedulePage();

    updateHomeSchedule();

}


function updateSchedulePage() {

    const select =
        document.getElementById(
            "scheduleLiverSelect"
        );


    if (!select) return;


    select.innerHTML =
        `
            <option value="">
                選択してください
            </option>
        `;


    livers.forEach(
        liver => {

            select.innerHTML += `

                <option value="${liver.id}">

                    ${escapeHTML(
                        liver.name
                    )}

                </option>

            `;

        }
    );


    const list =
        document.getElementById(
            "scheduleList"
        );


    if (!list) return;


    const sorted =
        [...schedules]
            .filter(
                item =>
                    new Date(
                        item.date
                    ) >=
                    new Date()
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    if (
        sorted.length === 0
    ) {

        list.innerHTML = `
            <div class="empty-card glass">
                配信予定はありません
            </div>
        `;

        return;

    }


    list.innerHTML =
        sorted
            .map(
                schedule => {

                    const liver =
                        livers.find(
                            item =>
                                item.id ===
                                schedule.liverId
                        );


                    return `

                        <div
                            class="schedule-item glass">

                            <button
                                type="button"
                                class="schedule-delete"
                                onclick="deleteSchedule(${schedule.id})">

                                ×

                            </button>


                            <div
                                class="schedule-item-name">

                                ${
                                    liver
                                    ? escapeHTML(
                                        liver.name
                                    )
                                    : "ライバー"
                                }

                            </div>


                            <div
                                class="schedule-item-date">

                                ${formatDateTime(
                                    schedule.date
                                )}

                            </div>


                            ${
                                schedule.memo
                                ? `
                                    <div
                                        class="schedule-item-memo">

                                        ${escapeHTML(
                                            schedule.memo
                                        )}

                                    </div>
                                `
                                : ""
                            }

                        </div>

                    `;

                }
            )
            .join("");

}


function updateHomeSchedule() {

    const area =
        document.getElementById(
            "homeScheduleArea"
        );


    if (!area) return;


    const sorted =
        [...schedules]
            .filter(
                item =>
                    new Date(
                        item.date
                    ) >=
                    new Date()
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )
            .slice(
                0,
                3
            );


    if (
        sorted.length === 0
    ) {

        area.innerHTML = `
            <div class="empty-card glass">
                まだ配信予定がありません
            </div>
        `;

        return;

    }


    area.innerHTML =
        sorted
            .map(
                schedule => {

                    const liver =
                        livers.find(
                            item =>
                                item.id ===
                                schedule.liverId
                        );


                    return `

                        <div
                            class="schedule-item glass">

                            <div
                                class="schedule-item-name">

                                ${
                                    liver
                                    ? escapeHTML(
                                        liver.name
                                    )
                                    : "ライバー"
                                }

                            </div>


                            <div
                                class="schedule-item-date">

                                ${formatDateTime(
                                    schedule.date
                                )}

                            </div>


                            ${
                                schedule.memo
                                ? `
                                    <div
                                        class="schedule-item-memo">

                                        ${escapeHTML(
                                            schedule.memo
                                        )}

                                    </div>
                                `
                                : ""
                            }

                        </div>

                    `;

                }
            )
            .join("");

}


function deleteSchedule(id) {

    schedules =
        schedules.filter(
            item =>
                item.id !== id
        );


    saveData();

    updateSchedulePage();

    updateHomeSchedule();

}


function getNextSchedule(
    liver
) {

    const list =
        schedules
            .filter(
                item =>
                    item.liverId ===
                    liver.id &&
                    new Date(
                        item.date
                    ) >=
                    new Date()
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    return (
        list[0] ||
        null
    );

}


/* ==================================================
   月替わり
================================================== */

function checkMonthChange() {

    const currentMonth =
        getMonthKey();


    const lastMonth =
        localStorage.getItem(
            "fanlab_current_month"
        );


    if (!lastMonth) {

        localStorage.setItem(
            "fanlab_current_month",
            currentMonth
        );

        return;

    }


    if (
        lastMonth ===
        currentMonth
    ) {

        return;

    }


    livers.forEach(
        liver => {

            archiveMonth(
                liver,
                lastMonth
            );


            updateStreaksForNewMonth(
                liver
            );


            liver.currentMonth = {

                comments: 0,

                watchMinutes: 0,

                giftPt: 0

            };


            liver.timerStart =
                null;

        }
    );


    localStorage.setItem(
        "fanlab_current_month",
        currentMonth
    );


    saveData();

}


/* ==================================================
   月データ保存
================================================== */

function archiveMonth(
    liver,
    month
) {

    if (
        !liver.monthlyArchive
    ) {

        liver.monthlyArchive =
            [];

    }


    const already =
        liver.monthlyArchive.some(
            item =>
                item.month ===
                month
        );


    if (already) return;


    const reachedLevels =
        (
            liver.fanlightHistory ||
            []
        )
            .filter(
                item =>
                    item.month ===
                    month
            )
            .map(
                item =>
                    item.level
            );


    liver.monthlyArchive.push({

        month:
            month,

        comments:
            liver.currentMonth.comments,

        watchMinutes:
            liver.currentMonth.watchMinutes,

        giftPt:
            liver.currentMonth.giftPt,

        reachedLevels:
            reachedLevels

    });

}


/* ==================================================
   連続月数
================================================== */

function updateStreaksForNewMonth(
    liver
) {

    for (
        let level = 1;
        level <= 5;
        level++
    ) {

        const data =
            liver.levelHistory?.[
                "lv" + level
            ];


        if (!data) continue;


        const previousMonth =
            getPreviousMonthKey();


        const achievedPrevious =
            liver.fanlightHistory?.some(
                item =>
                    item.month ===
                    previousMonth &&
                    item.level ===
                    level
            );


        if (
            !achievedPrevious
        ) {

            data.streak =
                0;

        }

    }

}


/* ==================================================
   Utility
================================================== */

function getMonthKey() {

    const now =
        new Date();


    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;

}


function getPreviousMonthKey() {

    const now =
        new Date();


    now.setMonth(
        now.getMonth() - 1
    );


    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;

}


function getDateKey() {

    const now =
        new Date();


    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;

}


function formatWatchTime(
    minutes
) {

    const safeMinutes =
        Math.max(
            0,
            Number(minutes) || 0
        );


    const hours =
        Math.floor(
            safeMinutes / 60
        );


    const mins =
        safeMinutes % 60;


    return (
        String(hours)
            .padStart(2, "0") +
        "h" +
        String(mins)
            .padStart(2, "0") +
        "m"
    );

}


function progressPercent(
    current,
    required
) {

    if (
        required === 0
    ) {

        return 100;

    }


    return Math.min(
        100,
        Math.round(
            current /
            required *
            100
        )
    );

}


function formatDateTime(
    value
) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return `
        ${date.getFullYear()}年
        ${date.getMonth() + 1}月
        ${date.getDate()}日
        ${String(
            date.getHours()
        ).padStart(2, "0")}:
        ${String(
            date.getMinutes()
        ).padStart(2, "0")}
    `.replace(
        /\s+/g,
        " "
    );

}


function formatHistoryDate(
    date
) {

    return `
        ${date.getMonth() + 1}/
        ${date.getDate()}
        ${String(
            date.getHours()
        ).padStart(2, "0")}:
        ${String(
            date.getMinutes()
        ).padStart(2, "0")}
    `.replace(
        /\s+/g,
        " "
    );

}


function formatHistoryShort(
    dateString
) {

    const parts =
        dateString.split("-");


    return `
        ${Number(parts[1])}/
        ${Number(parts[2])}
    `;

}


function formatMonth(
    month
) {

    const parts =
        month.split("-");


    return `
        ${parts[0]}年
        ${Number(parts[1])}月
    `;

}

/* ==================================================
   五十音インデックス
================================================== */

function setupKanaIndex() {

    document
        .querySelectorAll(".kana-index button")
        .forEach(button => {

            /*
             * 同じボタンに何度もイベントを付けない
             */

            button.onclick = () => {

                const kana =
                    button.dataset.kana;

                scrollToKana(kana);

            };

        });

}


function updateKanaIndex() {

    /*
     * updateHome() でカードを再生成しても
     * 五十音ボタンは動くようにする
     */

    setupKanaIndex();

}


function scrollToKana(kana) {

    const target =
        document.querySelector(
            `.kana-section-title[data-kana="${kana}"]`
        );


    if (!target) return;


    const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY;


    const offset = 90;


    window.scrollTo({

        top:
            Math.max(
                0,
                targetTop - offset
            ),

        behavior: "smooth"

    });

}

function getKanaGroup(reading) {

const first =
    String(reading || "")
        .trim()
        .charAt(0);
if ("あいうえお".includes(first)) return "あ";
if ("かきくけこがぎぐげご".includes(first)) return "か";
if ("さしすせそざじずぜぞ".includes(first)) return "さ";
if ("たちつてとだぢづでど".includes(first)) return "た";
if ("なにぬねの".includes(first)) return "な";
if ("はひふへほばびぶべぼぱぴぷぺぽ".includes(first)) return "は";
if ("まみむめも".includes(first)) return "ま";
if ("やゆよ".includes(first)) return "や";
if ("らりるれろ".includes(first)) return "ら";
if ("わをん".includes(first)) return "わ";
return "その他";

}

function sortLiversByKana(list) {

    return [...list].sort((a, b) => {

        const kanaA =
            String(a.kana || "").trim();

        const kanaB =
            String(b.kana || "").trim();

        return kanaA.localeCompare(
            kanaB,
            "ja"
        );

    });

}

function escapeHTML(
    text
) {

    return String(text)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}
/* ==================================================
   検索文字の正規化
================================================== */

function normalizeSearchText(text) {

    return String(text || "")
        .trim()
        .toLowerCase()
        .normalize("NFKC")
        .replace(/\s+/g, "");

}


/* ==================================================
   グローバル関数
================================================== */

window.openDetail =
    openDetail;

window.changeCondition =
    changeCondition;

window.toggleFavorite =
    toggleFavorite;

window.startWatching =
    startWatching;

window.endWatching =
    endWatching;

window.saveEdit =
    saveEdit;

window.toggleEdit =
    toggleEdit;

window.toggleRecordHistory =
    toggleRecordHistory;

window.toggleFanlightHistory =
    toggleFanlightHistory;

window.deleteSchedule =
    deleteSchedule;

window.deleteLiver =
    deleteLiver;

window.toggleWatchCorrection =
    toggleWatchCorrection;

window.toggleGiftCorrection =
    toggleGiftCorrection;

/* ==================================================
   ヘッダー検索
================================================== */
function setupHeaderSearch() {
    const headerSearch =
        document.getElementById("headerSearch");
    const menuSearch =
        document.getElementById("menuSearch");
    const liverSearch =
        document.getElementById("liverSearch");
    function syncSearch(value) {
        if (headerSearch) {
            headerSearch.value = value;
        }
        if (menuSearch) {
            menuSearch.value = value;
        }
        if (liverSearch) {
            liverSearch.value = value;
        }
        updateHome();
    }
    if (headerSearch) {
        headerSearch.addEventListener(
            "input",
            event => {
                syncSearch(
                    event.target.value
                );
            }
        );
    }
    if (menuSearch) {
        menuSearch.addEventListener(
            "input",
            event => {
                syncSearch(
                    event.target.value
                );
            }
        );
    }
    if (liverSearch) {
        liverSearch.addEventListener(
            "input",
            event => {
                syncSearch(
                    event.target.value
                );
            }
        );
    }
}
/* ==================================================
   検索文字の正規化
================================================== */
function normalizeSearchText(text) {
    return String(text || "")
        .normalize("NFKC")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "");
}