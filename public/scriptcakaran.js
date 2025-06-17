const scheduleForm = document.getElementById('scheduleForm');
    if(scheduleForm){
        scheduleForm.addEventListener('submit', function(e){
            e.preventDefault();

            const scheduleType = document.querySelector('input[name="scheduleType"]').value;
            const activityTitle = document.querySelector('input[name="activityTitle"]').value;
            const activityDesc = document.querySelector('input[name="activityDesc"]')
            const activityDate = document.querySelector('input[name="activityDate"]').value;

            const category = document.querySelector('input[name="category"]').value;
            const color = document.getElementById('colorPickerBtn').style.backgroundColor;
            const priority = currentLevel;

            let timeData ={};
            if(scheduleType === 'task'){
                timeData.startTime = document.getElementById('startTime').value;
            } else {
                timeData.endTime = document.getElementById('endTime').value;
            }

            const formData = {
                id: Data.now(),
                scheduleType,
                activityTitle,
                activityDesc,
                activityDate,
                category,
                color,
                priority,
                ...timeData
            };

            // simpan ke localStorage
            saveToLocalStorage(formData);

            // reset form
            scheduleForm.reset();
            currentLevel = -1;
            resetPriorityUI();

            // tampilkan data
            displaySavedData();
        });
    }

    function resetPriorityUI(){
        const info = document.getElementById(gem-info);
        if (info) {
            info.innerText = "";
        }

        for(let i = 0; i < gemData.length; i++){
            const gemImage = document.getElementById(`gem-${i}`);
            if (gemImage){
                gemImage.src = gemData[i].inactive;
            }
        }

        const sliderFill = document.getElementById("slider-fill");
        if(sliderFill){
            sliderFill.style.width = '0%';
            sliderFill.style.backgroundColor='transparent';
        }
    }

    function saveToLocalStorage(data){
        let savedData = JSON.parse(localStorage.getItem('questData')) || [];

        // tambahkan data baru
        savedData.push(data);

        // simpan kembali ke localStorage
        localStorage.setItem('questData', JSON.stringify(savedData));
    }


    // fungsi menampilkan data yang disimpan
    function displaySavedData(){
        const savedData = JSON.parse(localStorage.getItem('questData')) || [];
        const container = document.getElementById('questContainer');

        if (!container)return;

        container.innerHTML='';

        savedData.forEach(data=> {
            const questElement = createQuestElement(data);
            container.appendChild(questElement);
        });
    }

    function createQuestElement(data) {
        const questElement = document.createElement('div');
        questElement.className = 'bg-white rounded-lg p-4 mb-4 shadow';
        questElement.style.borderLeft = `4px solid ${data.color}`;
        
        const typeBadge = data.itemType === 'task' ? 
            '<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Task</span>' : 
            '<span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Event</span>';
        
        const priorityText = ['Non-Critical', 'Preventive', 'Urgent', 'Emergency'][data.priority];
        
        let timeInfo = '';
        if (data.itemType === 'task') {
            timeInfo = `<p class="text-sm text-gray-600">Deadline: ${data.deadlineTime}</p>`;
        } else {
            timeInfo = `<p class="text-sm text-gray-600">Time: ${data.startTime} - ${data.endTime}</p>`;
        }
        
        questElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-lg">${data.title}</h3>
                    ${typeBadge}
                </div>
                <span class="text-sm font-semibold" style="color: ${gemData[data.priority]?.color || '#000'}">
                    ${priorityText}
                </span>
            </div>
            <p class="text-gray-700 mt-2">${data.description}</p>
            <div class="mt-2">
                <p class="text-sm text-gray-600">Date: ${data.date}</p>
                ${timeInfo}
                <p class="text-sm text-gray-600">Category: ${data.category}</p>
            </div>
        `;
        
        return questElement;
    }
    
    // Panggil displaySavedData saat halaman dimuat
    displaySavedData();