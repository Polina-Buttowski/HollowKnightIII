
const pickupSound = new Audio('sounds/pickup.mp3');


const draggableItems = document.querySelectorAll('.left img, .right img');
const bag = document.querySelector('.bag');


let currentDraggedItem = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;


function isInDropZone(x, y) {
    const rect = bag.getBoundingClientRect();
    const tolerance = 50;
    
    return (
        x >= rect.left - tolerance &&
        x <= rect.right + tolerance &&
        y >= rect.top - tolerance &&
        y <= rect.bottom + tolerance
    );
}

function showCompletionImage() {

    const bagRect = bag.getBoundingClientRect();
    

    const completionImage = document.createElement('img');
    completionImage.src = 'images/completion.svg'; 
    completionImage.alt = 'Все предметы собраны!';
    completionImage.className = 'completion-image';
    

    completionImage.style.cssText = `
        position: absolute;
        top: ${bagRect.top + window.scrollY}px;
        left: ${bagRect.left + window.scrollX}px;
        width: ${bagRect.width}px;
        height: ${bagRect.height}px;
        object-fit: contain;
        z-index: 10;
        animation: fadeInScale 0.8s ease-out;
    `;
    

    bag.style.opacity = '0';
    bag.style.visibility = 'hidden';
    

    document.body.appendChild(completionImage);
    

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .completion-image {
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    

    window.addEventListener('resize', function repositionImage() {
        const newBagRect = bag.getBoundingClientRect();
        completionImage.style.top = `${newBagRect.top + window.scrollY}px`;
        completionImage.style.left = `${newBagRect.left + window.scrollX}px`;
        completionImage.style.width = `${newBagRect.width}px`;
        completionImage.style.height = `${newBagRect.height}px`;
    });
}

function checkAllItemsCollected() {
    const remainingItems = document.querySelectorAll('.left img, .right img');
    if (remainingItems.length === 0) {
        setTimeout(() => {
            showCompletionImage();
        }, 100);
    }
}


function startDragging(e, item) {
    e.preventDefault();
    

    pickupSound.currentTime = 0;
    pickupSound.play().catch(e => console.log("Ошибка воспроизведения звука:", e));
    
    currentDraggedItem = item;
    isDragging = true;

    const rect = item.getBoundingClientRect();

    let clientX, clientY;
    if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    
 
    item.style.opacity = '0.7';
    item.style.cursor = 'grabbing';
    item.style.position = 'fixed';
    item.style.zIndex = '1000';
}


function moveDraggedItem(e) {
    if (!isDragging || !currentDraggedItem) return;
    
    e.preventDefault();
    
    let clientX, clientY;
    
    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    

    let newLeft = clientX - offsetX;
    let newTop = clientY - offsetY;
    

    const maxLeft = window.innerWidth - currentDraggedItem.offsetWidth;
    const maxTop = window.innerHeight - currentDraggedItem.offsetHeight;
    
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
     
    currentDraggedItem.style.left = `${newLeft}px`;
    currentDraggedItem.style.top = `${newTop}px`;
}


function stopDragging(e) {
    if (!isDragging || !currentDraggedItem) return;
    
    isDragging = false;
    

    let dropX, dropY;
    if (e.type === 'touchend') {
        dropX = e.changedTouches[0].clientX;
        dropY = e.changedTouches[0].clientY;
    } else {
        dropX = e.clientX;
        dropY = e.clientY;
    }
    

    if (isInDropZone(dropX, dropY)) {

        if (currentDraggedItem.parentNode) {
            currentDraggedItem.parentNode.removeChild(currentDraggedItem);
            checkAllItemsCollected();
        }
    } else {

        currentDraggedItem.style.opacity = '1';
        currentDraggedItem.style.position = '';
        currentDraggedItem.style.zIndex = '';
        currentDraggedItem.style.left = '';
        currentDraggedItem.style.top = '';
        currentDraggedItem.style.cursor = 'grab';
    }
    
    currentDraggedItem = null;
}


document.addEventListener('DOMContentLoaded', function() {

    draggableItems.forEach(item => {
        item.style.cursor = 'grab';
        
        item.addEventListener('mousedown', (e) => startDragging(e, item));
        

        item.addEventListener('touchstart', (e) => startDragging(e, item), { passive: false });
    });
    
    document.addEventListener('mousemove', moveDraggedItem);
    document.addEventListener('touchmove', moveDraggedItem, { passive: false });
    
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    document.addEventListener('dragstart', (e) => e.preventDefault());
});











document.addEventListener('DOMContentLoaded', function() {
    function playSound(soundFile) {
        try {
            const sound = new Audio(soundFile);
            sound.volume = 0.7;
            sound.play();
        } catch (e) {}
    }
    
    const player = document.querySelector('.HollowKnight');
    const pinkmouse = document.querySelector('.pinkmouse');
    const graymouse = document.querySelector('.graymouse');
    const poster = document.querySelector('.poster');
    const dateImage = document.querySelector('.date');
    const aleImage = document.querySelector('.ale'); // Ale в игре
    const happyImage = document.querySelector('.happy');
    const freddyImage = document.querySelector('.freddy'); // Freddy попап
    const gameArea = document.getElementById('game');
    const mousesImage = document.querySelector('.mouses');
    const ticketImage = document.querySelector('.ticket');
    
    let hasPinkmouse = false;
    let isGraymouseEventTriggered = false;
    let isPosterEventTriggered = false;
    let isDateEventTriggered = false;
    let isAleEventTriggered = false; // Новое состояние для ale
    
    let playerX = 0;
    let playerY = 1700;
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
    
    const speed = 10;
    const keys = {};
    
    document.addEventListener('keydown', function(event) {
        keys[event.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', function(event) {
        keys[event.key.toLowerCase()] = false;
    });
    
    function movePlayer() {
        let oldX = playerX;
        let oldY = playerY;
        
        if (keys['w'] || keys['ц']) {
            playerY -= speed;
        }
        if (keys['s'] || keys['ы']) {
            playerY += speed;
        }
        if (keys['a'] || keys['ф']) {
            playerX -= speed;
        }
        if (keys['d'] || keys['в']) {
            playerX += speed;
        }
        
        const maxX = gameArea.clientWidth - player.clientWidth;
        const maxY = gameArea.clientHeight - player.clientHeight;
        
        playerX = Math.max(0, Math.min(playerX, maxX));
        playerY = Math.max(0, Math.min(playerY, maxY));
        
        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';
        
        checkCollisions();
        
        oldX = playerX;
        oldY = playerY;
    }
    
    function checkCollisions() {
        const playerRect = player.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        
        function getRelativeCoords(element) {
            const rect = element.getBoundingClientRect();
            return {
                left: rect.left - gameRect.left,
                top: rect.top - gameRect.top,
                width: rect.width,
                height: rect.height
            };
        }
        
        const playerGameX = playerX;
        const playerGameY = playerY;
        
        if (pinkmouse && pinkmouse.style.display !== 'none') {
            const pinkmouseCoords = getRelativeCoords(pinkmouse);
            
            if (playerGameX < pinkmouseCoords.left + pinkmouseCoords.width &&
                playerGameX + playerRect.width > pinkmouseCoords.left &&
                playerGameY < pinkmouseCoords.top + pinkmouseCoords.height &&
                playerGameY + playerRect.height > pinkmouseCoords.top) {
                
                pinkmouse.style.display = 'none';
                hasPinkmouse = true;
            }
        }
        
        if (graymouse && hasPinkmouse && !isGraymouseEventTriggered) {
            const graymouseCoords = getRelativeCoords(graymouse);
            
            const interactionDistance = 100;
            if (Math.abs(playerGameX - graymouseCoords.left) < interactionDistance &&
                Math.abs(playerGameY - graymouseCoords.top) < interactionDistance) {
                
                triggerGraymouseEvent();
            }
        }
        
        if (poster && !isPosterEventTriggered) {
            const posterCoords = getRelativeCoords(poster);
            
            const posterInteractionDistance = 150;
            if (Math.abs(playerGameX - posterCoords.left) < posterInteractionDistance &&
                Math.abs(playerGameY - posterCoords.top) < posterInteractionDistance) {
                
                triggerPosterEvent();
            }
        }
        
        if (dateImage && !isDateEventTriggered) {
            const dateCoords = getRelativeCoords(dateImage);
            
            const dateInteractionDistance = 150;
            if (Math.abs(playerGameX - dateCoords.left) < dateInteractionDistance &&
                Math.abs(playerGameY - dateCoords.top) < dateInteractionDistance) {
                
                triggerDateEvent();
            }
        }
        
        // Взаимодействие с ale
        if (aleImage && !isAleEventTriggered) {
            const aleCoords = getRelativeCoords(aleImage);
            
            const aleInteractionDistance = 150;
            if (Math.abs(playerGameX - aleCoords.left) < aleInteractionDistance &&
                Math.abs(playerGameY - aleCoords.top) < aleInteractionDistance) {
                
                triggerAleEvent();
            }
        }
    }
    
    function triggerGraymouseEvent() {
        isGraymouseEventTriggered = true;
        
        playSound('sounds/mouse_sound.mp3');
        
        mousesImage.style.display = 'block';
        
        setTimeout(function() {
            mousesImage.style.display = 'none';
        }, 7000);
    }
    
    function triggerPosterEvent() {
        isPosterEventTriggered = true;
        
        ticketImage.style.display = 'block';
        
        setTimeout(function() {
            ticketImage.style.display = 'none';
        }, 6000);
    }
    
    function triggerDateEvent() {
        isDateEventTriggered = true;
        
        happyImage.style.display = 'block';
        
        playSound('sounds/mouse_sound.mp3');
        
        setTimeout(function() {
            happyImage.style.display = 'none';
        }, 6000);
    }
    
    function triggerAleEvent() {
        isAleEventTriggered = true;
        
        freddyImage.style.display = 'block';
        
        playSound('sounds/urur.mp3');
        
        setTimeout(function() {
            freddyImage.style.display = 'none';
        }, 5000);
    }
    
    function gameLoop() {
        movePlayer();
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
});