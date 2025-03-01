function createAutocomplete({ root, optionTemplate, loadingTemplate, onOptionSelect }) {
    root.innerHTML = `
            <h2 class="font-semibold mt-6  text-gray-900">Search For a Movie</h2>        
            <div id="dropdown" class="relative inline-block mt-0 m-6 ml-0 text-left">
                <div>
                    <input id="menu-input" type="text" autocomplete="off" class="inline-flex w-auto md:w-xs lg:w-sm justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset focus:outline-none hover:bg-gray-50" aria-expanded="true" aria-haspopup="true" placeholder="Movie Name" />
                </div>
                <div id="dropdown-menu" class="hidden absolute z-10 mt-2 h-auto max-h-75 w-3xs md:w-xs lg:w-sm origin-top-right divide-y divide-gray-100 overflow-y-auto rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="search-input" tabindex="-1">
                </div>
            </div>`;

    const dropMenu = root.querySelector('#dropdown-menu');
    const dropInput = root.querySelector('#menu-input');

    async function displayMenu(e) {
        dropMenu.innerHTML = '';

        if (e.target.value.trim() === '' || !e.target.value) {
            dropMenu.classList.add('hidden');
            return;
        }

        dropMenu.classList.remove('hidden');
        showDropMenuLoading();
        const searchResults = await fetchAPI(`s=${e.target.value}`);

        hideDropMenuLoading();

        if (!searchResults) {
            dropMenu.classList.add('hidden');
        } else {
            searchResults.forEach((item, index) => {
                if (item.Type == 'movie') {
                    const option = document.createElement('a');
                    option.href = `#`;
                    option.className =
                        'search-item flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:outline-hidden';
                    option.id = `search-item-${index}`;
                    option.tabIndex = -1;
                    option.innerHTML = optionTemplate(item);

                    option.addEventListener('click', () => {
                        dropInput.value = item.Title;
                        onOptionSelect(item);
                    });
                    dropMenu.appendChild(option);
                }
            });
        }
    }

    function showDropMenuLoading() {
        const loading = document.createElement('div');
        loading.className = 'py-1';
        loading.id = 'animation';
        loading.innerHTML = loadingTemplate;

        dropMenu.appendChild(loading);
    }

    function hideDropMenuLoading() {
        document.querySelector(`#animation`).remove();
    }

    function hideOnSelectOrBlur(e) {
        if (
            !root.querySelector('#dropdown').contains(e.target) ||
            dropInput.value.trim() === '' ||
            !dropMenu.childElementCount ||
            e.target.classList.contains('search-item') ||
            e.target.parentElement.parentElement.classList.contains('search-item') ||
            e.target.parentElement.classList.contains('search-item')
        ) {
            dropMenu.classList.add('hidden');
        } else {
            dropMenu.classList.remove('hidden');
        }
    }

    dropInput.addEventListener('input', debounce(displayMenu));
    document.addEventListener('click', hideOnSelectOrBlur);
}
