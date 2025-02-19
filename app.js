let clickeado = false;
const r = document.querySelector(':root');
const p = document.getElementById("palet");

p.addEventListener("click", function() {
    if(clickeado == false) {
        r.style.setProperty('--background', '#f7f7f7');
        r.style.setProperty('--transparent', '#ebebf0');
        r.style.setProperty('--text', '#131215');
        p.textContent = '☾';

        clickeado = true;
    } else if (clickeado == true){
        r.style.setProperty('--background', '#17171f');
        r.style.setProperty('--transparent', '#2f2f3d');
        r.style.setProperty('--text', '#f0f1f6');
        p.textContent = '☼';

        clickeado = false;
    };
});


let timeout;
let exclude = true;

function DisplayStats() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const text = document.getElementById("text").value;

        let spaces = 0;
        for (const letter of text) {
            if (letter === ' ') spaces++;
        }

        let totalCharacters = exclude ? text.length : text.length - spaces;
        document.getElementById("Total_Characters").textContent = totalCharacters > 0 ? totalCharacters : "00";

        let words = text.trim().split(/\s+/).filter(Boolean).length;
        document.getElementById("Word_Count").textContent = words > 0 ? words : "00";

        let sentences = (text.match(/[.!?]+/g) || []).length;
        document.getElementById("Sentence_Count").textContent = sentences > 0 ? sentences : "00";

        const seconds = document.getElementById("seconds");
        if (text.length - spaces >= 3600) {
            seconds.textContent = (~~((text.length - spaces) / 3600)) == 1 ? `${~~((text.length - spaces) / 3600)} hour` : `${~~((text.length - spaces) / 3600)} hours`;
        } else if (text.length - spaces >= 60) {
            seconds.textContent = (~~((text.length - spaces) / 60)) == 1 ? `${~~((text.length - spaces) / 60)} minute` : `${~~((text.length - spaces) / 60)} minutes`;
        } else {
            seconds.textContent = text.length - spaces == 1 ? `${text.length - spaces} second` : `${text.length - spaces} seconds`;
        }

        /*--STATISTICS--*/
        const statistic = document.getElementById("letter-density");
        const message = document.getElementById("default-message");

        function topNEntries(obj, n) {
            return Object.entries(obj)
                .filter(([_, value]) => typeof value === "number")
                .sort((a, b) => b[1] - a[1])
                .slice(0, n);
        }

        if (text.length === 0) {
            message.removeAttribute("hidden");
            statistic.setAttribute("hidden", "");
        } else {
            message.setAttribute("hidden", "");
            statistic.removeAttribute("hidden");

            let density = {};
            let copyText = text.replace(/[^a-zA-Z]/g, "");
            let totalLetters = copyText.length;

            for (const letter of copyText) {
                density[letter] = (density[letter] || 0) + 1;
            }

            const result = topNEntries(density, Math.min(Object.keys(density).length, 5));

            for (let i = 0; i < 5; i++) {
                const letterElement = document.getElementById(`letter--${i + 1}`);
                const barElement = document.getElementById(`bar--percentage--${i + 1}`);
                const percentageElement = document.getElementById(`percentage--${i + 1}`);

                if (i < result.length) {
                    letterElement.textContent = result[i][0].toUpperCase();
                    let percentage = ((result[i][1] * 100) / totalLetters).toFixed(2);
                    barElement.style.width = percentage + "%";
                    percentageElement.textContent = `${result[i][1]} (${percentage}%)`;
                } else {
                    letterElement.textContent = "";
                    barElement.style.width = "0%";
                    percentageElement.textContent = "";
                }
            }
        }
    }, 400);
}

document.getElementById("text").addEventListener("input", DisplayStats);

const c1 = document.getElementById("space");
c1.addEventListener("change", function () {
    exclude = !exclude;
    DisplayStats();
});


const c2 = document.getElementById("limit");
let limit = true;
c2.addEventListener("change", function() {
    const input_text = document.getElementById("text");
    const input_limit = document.getElementById("n-limit");

    if (limit == true) {
        input_limit.removeAttribute("hidden");
        input_limit.value = 0;
    } else {
        input_limit.setAttribute("hidden", "");
        input_text.removeAttribute("maxlength");
    }

    limit = !limit;
});

document.getElementById("n-limit").addEventListener("input", CharacterLimit);

function CharacterLimit() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const input_text = document.getElementById("text");
        const input_limit = document.getElementById("n-limit");

        if (input_limit.value == '') {
            input_limit.value = 0;
        }

        const maxLength = parseInt(input_limit.value, 10) || 0; 
        let currentText = input_text.value; 
        input_text.setAttribute("maxlength", maxLength);

        if (currentText.length > maxLength) {
            input_text.value = currentText.substring(0, maxLength);
        }

        DisplayStats();
    }, 1200);
}

