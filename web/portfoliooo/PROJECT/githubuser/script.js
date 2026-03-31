const inp = document.querySelector(".inp");
const cards = document.querySelector(".cards");
const btn = document.querySelector(".searchBtn");

// ── Search on Enter key press ────────────────────────────────────────────────
inp.addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchUser();
});

// ── Main search function ─────────────────────────────────────────────────────
async function searchUser() {
    const username = inp.value.trim();

    if (!username) {
        cards.innerHTML = `<p class="status-msg">Please enter a username 🙂</p>`;
        return;
    }

    // Show loading state
    cards.innerHTML = `
        <div class="status-msg">
            <div class="loader"></div>
            Searching for <strong>@${username}</strong>...
        </div>`;

    try {
        // 🔥 Real GitHub API call — no key needed for public profiles
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            cards.innerHTML = `<p class="status-msg">User <strong>"@${username}"</strong> not found 😢<br><small>Check the spelling and try again</small></p>`;
            return;
        }

        const user = await response.json();
        renderCard(user);

    } catch (error) {
        cards.innerHTML = `<p class="status-msg">Network error 😥<br><small>Check your connection and try again</small></p>`;
    }
}

// ── Render one GitHub profile card ──────────────────────────────────────────
function renderCard(user) {
    cards.innerHTML = ""; // clear old card

    const card = document.createElement("div");
    card.classList.add("card");

    // Click card → open GitHub profile in new tab
    card.addEventListener("click", () => {
        window.open(user.html_url, "_blank");
    });

    // Profile picture
    const img = document.createElement("img");
    img.src = user.avatar_url;
    img.alt = user.login;
    img.classList.add("bg-img");

    // Blurred gradient overlay — FIX: use ${} not $()
    const blurredLayer = document.createElement("div");
    blurredLayer.style.backgroundImage = `url(${user.avatar_url})`; // ✅ fixed
    blurredLayer.classList.add("blurred-layer");

    // Content area
    const content = document.createElement("div");
    content.classList.add("content");

    // Name
    const heading = document.createElement("h3");
    heading.textContent = user.name || user.login;

    // @username handle
    const handle = document.createElement("p");
    handle.classList.add("handle");
    handle.textContent = `@${user.login}`;

    // Bio
    const bio = document.createElement("p");
    bio.classList.add("bio");
    bio.textContent = user.bio || "No bio available.";

    // Stats row — repos & followers
    const stats = document.createElement("div");
    stats.classList.add("stats");
    stats.innerHTML = `
        <span>📦 <strong>${user.public_repos}</strong> repos</span>
        <span>👥 <strong>${user.followers}</strong> followers</span>
    `;

    // Location (if available)
    if (user.location) {
        const loc = document.createElement("p");
        loc.classList.add("location");
        loc.textContent = `📍 ${user.location}`;
        content.appendChild(heading);
        content.appendChild(handle);
        content.appendChild(bio);
        content.appendChild(stats);
        content.appendChild(loc);
    } else {
        content.appendChild(heading);
        content.appendChild(handle);
        content.appendChild(bio);
        content.appendChild(stats);
    }

    card.appendChild(img);
    card.appendChild(blurredLayer);
    card.appendChild(content);
    cards.appendChild(card);
}
