let currentUser = null;

function showSignup() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("signupSection").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
}

function signup() {
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    if (localStorage.getItem(username)) {
        alert("User already exists!");
        return;
    }

    localStorage.setItem(username, JSON.stringify({
        password: password,
        memories: []
    }));

    alert("Account Created Successfully!");
    showLogin();
}

function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const user = JSON.parse(localStorage.getItem(username));

    if (!user || user.password !== password) {
        alert("Invalid credentials!");
        return;
    }

    currentUser = username;
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("diarySection").classList.remove("hidden");

    loadMemories();
}

function addMemory() {
    const text = document.getElementById("memoryText").value;
    const imageInput = document.getElementById("memoryImage");

    if (!text) return;

    const reader = new FileReader();

    reader.onload = function () {
        const userData = JSON.parse(localStorage.getItem(currentUser));

        const now = new Date();
        const dateTime = now.toLocaleString();

        userData.memories.push({
            text: text,
            image: reader.result || null,
            date: dateTime
        });

        localStorage.setItem(currentUser, JSON.stringify(userData));

        document.getElementById("memoryText").value = "";
        imageInput.value = "";

        loadMemories();
    };

    if (imageInput.files[0]) {
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        reader.onload();
    }
}

function loadMemories() {
    const memoryList = document.getElementById("memoryList");
    memoryList.innerHTML = "";

    const userData = JSON.parse(localStorage.getItem(currentUser));

    userData.memories.forEach((memory, index) => {
        const div = document.createElement("div");
        div.className = "memory";

        div.innerHTML = `
            <div class="memory-date">${memory.date}</div>
            <div>${memory.text}</div>
            ${memory.image ? `<img src="${memory.image}">` : ""}
            <button class="delete-btn" onclick="deleteMemory(${index})">x</button>
        `;

        memoryList.appendChild(div);
    });
}

function deleteMemory(index) {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    userData.memories.splice(index, 1);
    localStorage.setItem(currentUser, JSON.stringify(userData));
    loadMemories();
}

function logout() {
    currentUser = null;
    document.getElementById("diarySection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
}