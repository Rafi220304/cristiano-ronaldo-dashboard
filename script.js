Papa.parse("dataset.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function (results) {

        const data = results.data.filter(row => row.competition);

        // ============================
        // FUNCTION GET YEAR
        // ============================

        function getYear(dateString) {

            if (!dateString) return "";

            const parts = dateString.split("/");

            if (parts.length !== 3) return "";

            let year = Number(parts[2]);

            if (year < 100) {

                year = year >= 80 ? 1900 + year : 2000 + year;

            }

            return year;

        }

        // ============================
        // KPI
        // ============================

        const competitionList = [...new Set(data.map(x => x.competition))];

        const clubList = [...new Set(data.map(x => x.team))];

        const seasonList = [...new Set(data.map(x => getYear(x.match_date)))].filter(Boolean);

        document.getElementById("totalGoals").textContent = 978;

        document.getElementById("competition").textContent =
            competitionList.length;

        document.getElementById("clubs").textContent =
            clubList.length;

        document.getElementById("season").textContent =
            seasonList.length;

        // ============================
        // GOALS PER SEASON
        // ============================

        const seasonMap = {};

        data.forEach(row => {

            const year = getYear(row.match_date);

            if (!year) return;

            seasonMap[year] = (seasonMap[year] || 0) + 1;

        });

        const seasonLabels = Object.keys(seasonMap).sort((a, b) => a - b);

        const seasonData = seasonLabels.map(year => seasonMap[year]);

        new Chart(document.getElementById("seasonChart"), {

    type: "line",

    data: {
        labels: seasonLabels,
        datasets: [{
            label: "Goals",
            data: seasonData,
            borderColor: "#FACC15",
            backgroundColor: "rgba(250,204,21,0.2)",
            fill: true,
            tension: 0.35
        }]
    },

    options: {

        responsive: true,

        animation: {
            duration: 1500
        },

        plugins: {
            legend: {
                display: false
            }
        }

    }

});

        // ============================
        // GOALS BY COMPETITION
        // ============================

        const competitionMap = {};

        data.forEach(row => {

            competitionMap[row.competition] =
                (competitionMap[row.competition] || 0) + 1;

        });

        const competitionLabels = Object.keys(competitionMap);

        const competitionData = competitionLabels.map(
            item => competitionMap[item]
        );

        new Chart(document.getElementById("competitionChart"), {

            type: "bar",

            data: {

                labels: competitionLabels,

                datasets: [{

                    data: competitionData,

                    backgroundColor: "#38BDF8",

                    borderRadius: 8

                }]

            },

            options: {
                

                indexAxis: "y",

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        ticks: {

                            color: "white"

                        },

                        grid: {

                            color: "#334155"

                        }

                    },

                    y: {

                        ticks: {

                            color: "white"

                        },

                        grid: {

                            display: false

                        }

                    }

                }

            }

        });

                // ============================
        // GOALS BY CLUB
        // ============================

        const clubMap = {};

        data.forEach(row => {

            clubMap[row.team] = (clubMap[row.team] || 0) + 1;

        });

        // Urutkan dari gol terbanyak
        const sortedClubs = Object.entries(clubMap)
            .sort((a, b) => b[1] - a[1]);

        const clubLabels = sortedClubs.map(item => item[0]);

        const clubData = sortedClubs.map(item => item[1]);

        new Chart(document.getElementById("clubChart"), {

            type: "bar",

            data: {

                labels: clubLabels,

                datasets: [{

                    label: "Goals",

                    data: clubData,

                    backgroundColor: "#22C55E",

                    borderRadius: 8

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        ticks: {

                            color: "white"

                        },

                        grid: {

                            display: false

                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: "white"

                        },

                        grid: {

                            color: "#334155"

                        }

                    }

                }

            }

        });

        // ============================
        // GOAL MINUTE DISTRIBUTION
        // ============================

        const minuteMap = {};

        data.forEach(row => {

            const minute = row.goal_minute_bucket || "Unknown";

            minuteMap[minute] = (minuteMap[minute] || 0) + 1;

        });

        const minuteLabels = Object.keys(minuteMap);

        const minuteData = minuteLabels.map(item => minuteMap[item]);

        new Chart(document.getElementById("minuteChart"), {

            type: "doughnut",

            data: {

                labels: minuteLabels,

                datasets: [{

                    data: minuteData,

                    backgroundColor: [

                        "#FACC15",
                        "#EF4444",
                        "#3B82F6",
                        "#22C55E",
                        "#A855F7",
                        "#F97316",
                        "#06B6D4",
                        "#64748B"

                    ],

                    borderWidth: 2,

                    borderColor: "#0F172A"

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            color: "white"

                        }

                    }

                }

            }

        });

                // ============================
        // CAREER STATISTICS (2016-2026)
        // ============================

        const tbody = document.getElementById("tableBody");

        tbody.innerHTML = "";

        const recentMatches = data.filter(row => {

            const year = getYear(row.match_date);

            return year >= 2016 && year <= 2026;

        });

        // Urutkan dari tanggal terbaru
        recentMatches.sort((a, b) => {

            return new Date(b.match_date) - new Date(a.match_date);

        });

        // Ambil maksimal 20 pertandingan
        recentMatches.slice(0, 20).forEach(row => {

            tbody.innerHTML += `
                <tr>
                    <td>${row.match_date}</td>
                    <td>${row.team}</td>
                    <td>${row.competition}</td>
                    <td>${row.opponent}</td>
                    <td>${row.goal_minute}'</td>
                </tr>
            `;

        });

        console.log("Dashboard Loaded");
        console.log(data);

    }

});
