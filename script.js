document.addEventListener("DOMContentLoaded", async() => {
    const perfumeModalElement = document.getElementById("modalPerfume");
    const openModal = document.getElementById('openModal');
    const closeModal = document.querySelector('.btn-close');
    const addPerfumeButton = document.getElementById('addPerfume');
    const pNameInput = document.getElementById('pName');
    const pInfoInput = document.getElementById('pInfo');
    const pLinkInput = document.getElementById('pLink');
    const pRatingInput = document.getElementById('pRating');
    const perfumeModal = new bootstrap.Modal(perfumeModalElement);

    openModal.onclick = function () {
        perfumeModal.show();
    }

    closeModal.onclick = function () {
        perfumeModal.hide();
    }

    function addPerfume() {
        const pName = pNameInput.value.trim();
        const pInfo = pInfoInput.value.trim();
        const pLink = pLinkInput.value.trim();
        const pRating = pRatingInput.value.trim();
        const pImageInput = document.getElementById('pImage');
        const pImageFile = pImageInput.files[0];
        const reader = new FileReader();

        if (pName && pInfo && pImageFile && pLink && pRating) {
            reader.onload = function (e) {
                const perfume = {
                    name: pName,
                    info: pInfo,
                    link: pLink,
                    rating: pRating,
                    image: e.target.result
                };

                let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
                perfumes.push(perfume);
                localStorage.setItem('perfumes', JSON.stringify(perfumes));

                displayPerfume(perfume);

                pNameInput.value = '';
                pInfoInput.value = '';
                pLinkInput.value = '';
                pRatingInput.value = '';
                pImageInput.value = '';

                perfumeModal.hide();
            };
            reader.readAsDataURL(pImageFile);
        } else {
            alert("Please fill in all fields and choose an Image");
        }
    }

    function displayPerfume(perfume) {
        const targetContainer = document.querySelector('.row-cols-1.row-cols-sm-2.row-cols-md-3.g-3');
        const HTMLString = `
        <div class="col">
            <div class="card shadow-sm">
                <img src="${perfume.image}" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="${perfume.name}">
                <div class="card-body">
                    <a href="${perfume.link}" target="_blank" rel="noopener noreferrer">
                        <p id="card-name" class="card-text"><strong>${perfume.name}</strong></p>
                    </a>
                    <p id="card-info" class="card-text">${perfume.info}</p>
                    <p id="card-rating" class="card-text">Rating: ${perfume.rating}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button type="button" class="btn btn-outline-info btn-sm px-3 me-sm-3 edit-button">Edit</button>
                        <button type="button" class="btn btn-outline-danger btn-sm px-3 me-sm-3 delete-button">Delete</button>    
                    </div>
                </div>
            </div>
        </div>`;

        targetContainer.insertAdjacentHTML('beforeend', HTMLString);
    }

    const perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
    perfumes.forEach(displayPerfume);

    addPerfumeButton.onclick = addPerfume;

    let currentEdit = null;

    document.addEventListener("click", function (event){
        if (event.target.classList.contains('edit-button')) {
            const editModalElement = document.getElementById('editModal');
            const editModal = new bootstrap.Modal(editModalElement);

            currentEdit = event.target.closest('.col');

            const cardBody = currentEdit.querySelector('.card-body');

            document.getElementById('pNameEdit').value = cardBody.querySelector('#card-name').textContent.trim();
            document.getElementById('pInfoEdit').value = cardBody.querySelector('#card-info').textContent.trim();
            document.getElementById('pLinkEdit').value = cardBody.querySelector('a').href;
            document.getElementById('pRatingEdit').value = cardBody.querySelector('#card-rating').textContent.replace('Rating: ', '').trim();

            document.getElementById('pImageEdit').value = '';

            editModal.show();
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            event.preventDefault();
            event.stopPropagation();

            const perfumeCard = event.target.closest('.col');
            const perfumeName = perfumeCard.querySelector('#card-name').textContent.trim();

            let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
            perfumes = perfumes.filter(perfume => perfume.name.toLowerCase() !== perfumeName.toLowerCase());
            localStorage.setItem('perfumes', JSON.stringify(perfumes));

            perfumeCard.remove();
        }
    });


    const saveChangesButton = document.getElementById('save');

    saveChangesButton.addEventListener('click', function () {
        if (currentEdit) {
            const editedName = document.getElementById('pNameEdit').value.trim();
            const editedInfo = document.getElementById('pInfoEdit').value.trim();
            const editedPic = document.getElementById('pImageEdit').files[0];
            const editedLink = document.getElementById('pLinkEdit').value.trim();
            const editedRating = document.getElementById('pRatingEdit').value.trim();

            const cardName = currentEdit.querySelector('#card-name').textContent.trim();
            let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];

            const perfumeIndex = perfumes.findIndex(perfume => perfume.name === cardName);

            if (perfumeIndex > -1) {
                if (editedName) perfumes[perfumeIndex].name = editedName;
                if (editedInfo) perfumes[perfumeIndex].info = editedInfo;
                if (editedLink) perfumes[perfumeIndex].link = editedLink;
                if (editedRating) perfumes[perfumeIndex].rating = editedRating;

                if (editedPic) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        perfumes[perfumeIndex].image = e.target.result;
                        updatePerfumeDisplay(perfumes[perfumeIndex]);
                        localStorage.setItem('perfumes', JSON.stringify(perfumes));
                    };
                    reader.readAsDataURL(editedPic);
                } else {
                    updatePerfumeDisplay(perfumes[perfumeIndex]);
                    localStorage.setItem('perfumes', JSON.stringify(perfumes));
                }
            }

            const editModalElement = document.getElementById('editModal');
            const editModal = bootstrap.Modal.getInstance(editModalElement);
            editModal.hide();
            currentEdit = null;
        }
    });

    function updatePerfumeDisplay(perfume) {
        if (currentEdit) {
            currentEdit.querySelector('#card-name').innerHTML = `<strong>${perfume.name}</strong>`;
            currentEdit.querySelector('#card-info').textContent = perfume.info;
            currentEdit.querySelector('#card-rating').textContent = `Rating: ${perfume.rating}`;
            currentEdit.querySelector('a').href = perfume.link;
            if (perfume.image) {
                currentEdit.querySelector('img').src = perfume.image;
            }
        }
    }


    const closeEditModal = document.getElementById('closeEdit');

    if (closeEditModal) {
        closeEditModal.addEventListener('click', function() {
            const editModalElement = document.getElementById("editModal");
            const editModal = bootstrap.Modal.getInstance(editModalElement);
            editModal.hide();
            currentEdit = null;
        });
    }
});