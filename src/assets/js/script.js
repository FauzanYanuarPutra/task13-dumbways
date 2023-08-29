function submitForm() {
  let name = document.getElementById("input-name").value;
  let email = document.getElementById("input-email").value;
  let phone = document.getElementById("input-phone").value;
  let subject = document.getElementById("input-subject").value;
  let message = document.getElementById("input-message").value;

  if (name == "") {
    return alert("Nama harus diisi!");
  } else if (email == "") {
    return alert("Email harus diisi!");
  } else if (phone == "") {
    return alert("Phone harus diisi!");
  } else if (subject == "") {
    return alert("Subject harus diisi!");
  } else if (message == "") {
    return alert("Message harus diisi!");
  }

  const kiriman = {
    name: name,
    email: email,
    phone: phone,
    subject: subject,
    message: message,
  };

  console.log(kiriman);
  sendEmail(kiriman);
}

function sendEmail(props) {
  let emailReceiver = "fauzanyanuarp@gmail.com";

  let a = document.createElement("a");
  a.href = `mailto:${emailReceiver}?subject=${props.subject}&body=Hello my name ${props.name}, ${props.subject}, ${props.message}`;
  a.click();
}

function showAdd() {
  const idForm = document.getElementById("form-project");
  const bg = document.querySelector(".background-close");
  const body = document.body;

  idForm.classList.toggle("hidden");
  bg.classList.toggle("hidden");
  body.classList.toggle("no-scroll");
}

// POST BLOG / PROJECT

const DataProject = [
  {
    name: "Real Estate Website",
    startDate: new Date("2023-08-01"),
    endDate: new Date("2024-08-12"),
    description:
      "Website Real Estate: Temukan Rumah Impian Anda dengan Kemudahan dan Kepercayaan. Selamat datang di Website Real Estate, destinasi online yang dirancang khusus untuk membantu Anda menemukan properti yang sesuai dengan kebutuhan dan impian Anda. Dengan jaringan luas agen terpercaya dan beragam pilihan properti, kami berkomitmen untuk menjadi mitra Anda dalam perjalanan mencari tempat yang Anda sebut rumah.",
    technologies: ["socket-io", "react", "typescript"],
    image: "../assets/images/project4.png",
    postAt: new Date("2023-08-01T12:00:00"),
  },
  {
    name: "Belajar Ngaji Website",
    startDate: new Date("2023-07-15"),
    endDate: new Date("2023-07-30"),
    description:
      "Website Belajar Ngaji: Menemani Perjalanan Spiritual Anda Menuju Kedekatan dengan Al-Quran. Selamat datang di website Belajar Ngaji, tempat di mana Anda dapat memulai atau melanjutkan perjalanan spiritual Anda dalam memahami dan menghafal Al-Quran dengan mudah dan nyaman. Kami telah merancang platform ini dengan penuh dedikasi untuk membantu Anda memperdalam hubungan dengan Kitab Suci dan memperluas pemahaman Anda tentang ajaran Islam.",
    technologies: ["react", "node-js"],
    image: "../assets/images/project2.png",
    postAt: new Date("2023-07-15T08:01:00"),
  },
];
renderProjects();

function iconCard(technologies) {
  console.log(technologies);

  return technologies
    .map(
      (tech) =>
        `<img src="./../assets/svg/${tech}.svg" alt="${tech}" style="width: 20px; height: 20px;">`
    )
    .join("");
}

function renderProjects() {
  const contentContainer = document.getElementById("content-card-project");
  contentContainer.innerHTML = "";

  console.log(DataProject);

  DataProject.forEach((project) => {
    project.durasi = calculateDuration(project.startDate, project.endDate);

    const projectHTML = `
          <a href="projectDetail.html" class="card-project">
            <div style="width:100%; position:relative">
              <img src="${project.image}" alt="" style="width: 100%;">
              <div style="position:absolute; top: 0; left:0; margin: 10px; padding: 3px 10px; background:orangered; color:white ">${getFullTime(
                project.postAt
              )}</div>
              <div style="position:absolute; bottom: 0; left:0; margin: 10px; padding: 3px 10px;  background-color: rgba(0, 0, 0, 0.8); color:white ">${getDistanceTime(
                project.postAt
              )}</div>
            </div>
            <div>
              <p class="judul">${project.name}</p>
              <p>durasi :  ${formatDuration(project.durasi)}</p>
              
              <p class="about">${project.description}</p>
              <div class="icon-project">
                ${iconCard(project.technologies)}
              </div>
              <div class="button-project">
                <div>Edit</div>
                <div>Delete</div>
              </div>
            </div>
          </a>
        `;

    contentContainer.innerHTML += projectHTML;
  });
}
function addBlog(event) {
  event.preventDefault();
  // console.log("Hallo");

  const projectName = document.getElementById("project-name").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const description = document.getElementById("description").value;

  const technologies = Array.from(
    document.querySelectorAll(".tech-check input[type='checkbox']:checked")
  ).map((checkbox) => checkbox.getAttribute("data-tech"));

  const Checkbox = document.querySelector(".checkox-judul");
  const errorCheckbox = document.querySelector(".checkbox-error-validate");

  const Deskripsi = document.querySelector(".deskription");
  const errorDeskripsi = document.querySelector(".deskripsi-error-validate");

  const date = document.querySelector(".date-project");
  const dateValidate = document.querySelector(".date-validate");

  let hasError = false;

  if (endDate < startDate) {
    dateValidate.classList.remove("hidden");
    hasError = true;
  } else {
    dateValidate.classList.add("hidden");
  }

  if (description.length <= 150) {
    errorDeskripsi.classList.remove("hidden");
    hasError = true;
  } else {
    errorDeskripsi.classList.add("hidden");
  }

  if (technologies.length === 0) {
    errorCheckbox.classList.remove("hidden");
    hasError = true;
  } else {
    errorCheckbox.classList.add("hidden");
  }

  if (hasError) {
    if (!dateValidate.classList.contains("hidden")) {
      scroll(date);
    } else if (!errorDeskripsi.classList.contains("hidden")) {
      scroll(Deskripsi);
    } else if (!errorCheckbox.classList.contains("hidden")) {
      scroll(Checkbox);
    }
  }

  function scroll(props) {
    props.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!hasError) {
    const newProject = {
      name: projectName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description: description,
      technologies: technologies,
      image: imagePreview.src,
      durasi: calculateDuration(new Date(startDate), new Date(endDate)),
      postAt: new Date(),
    };

    DataProject.push(newProject);
    renderProjects();

    showAdd();

    const contentContainer = document.getElementById("content-card-project");
    const lastProject = contentContainer.lastElementChild;
    lastProject.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

const imageInput = document.querySelector("#image");
const imagePreview = document.querySelector("#image-preview");

imageInput.addEventListener("change", function (event) {
  const selectedImage = event.target.files[0];
  const imageUrl = selectedImage ? URL.createObjectURL(selectedImage) : "";

  imagePreview.src = imageUrl;

  if (imageUrl) {
    imagePreview.classList.remove("hidden");
  } else {
    imagePreview.classList.add("hidden");
  }
});

function calculateDuration(startDate, endDate) {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  const dayDiff = endDate.getDate() - startDate.getDate();

  if (yearDiff === 0 && monthDiff === 0 && dayDiff === 0) {
    return "1 hari";
  }

  return { years: yearDiff, months: monthDiff, days: dayDiff + 1 };
}

function formatDuration(duration) {
  if (typeof duration === "string") {
    return duration;
  }

  const parts = [];

  if (duration.years > 0) {
    parts.push(`${duration.years} tahun`);
  }

  if (duration.months > 0) {
    parts.push(`${duration.months} bulan`);
  }

  if (duration.days > 0) {
    parts.push(`${duration.days} hari`);
  }

  return parts.join(", ");
}

function getFullTime(time) {
  let monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let date = time.getDate();
  let monthIndex = time.getMonth();
  let year = time.getFullYear();
  let hours = time.getHours();
  let minutes = time.getMinutes();

  if (hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes <= 9) {
    minutes = "0" + minutes;
  }

  return `${date} ${monthName[monthIndex]} ${year} ${hours}:${minutes} WIB`;
}

function getDistanceTime(time) {
  const timeNow = new Date();
  const distance = timeNow - time;

  const intervals = [
    { label: "days", duration: 24 * 60 * 60 * 1000 },
    { label: "hours", duration: 60 * 60 * 1000 },
    { label: "minutes", duration: 60 * 1000 },
    { label: "seconds", duration: 1000 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(distance / interval.duration);
    if (count > 0) {
      return `${count} ${interval.label} ago`;
    }
  }
  return "Just now";
}

setInterval(renderProjects, 3000);
