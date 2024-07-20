const thumbs = document.querySelectorAll('.thumbnail')
const lightbox = document.querySelector('.lightbox')
const lightboxImg = document.querySelector('.lightbox-image')
const figcaption = document.createElement('figcaption')

// functions to open/close lightbox and fetch caption data
async function openLightbox(image) {
    const imageID = image.getAttribute('data-thumbID')
    const data = await fetchData()
    const caption = data.find((item) => item.id === imageID )

    figcaption.classList.add('figcaption')
    figcaption.innerHTML = `
        <p>Photo by <a href="${caption.artistURL}">${caption.artist}</a> on <a href="${caption.imageURL}">Unsplash</a></p>
    `
    lightboxImg.append(image)
    lightboxImg.append(figcaption)
}

function closeLightbox(image) {
    const galleryParentID = image.getAttribute('data-thumbID')
    const galleryParent = document.getElementById(`${galleryParentID}`)

    galleryParent.append(image)
    lightboxImg.removeChild(figcaption)
}

async function fetchData() {
    let response = await fetch('data.json')

    if(!response.ok) {
        throw 'Something went wrong'
    }

    let data = await response.json()
    return data
}

thumbs.forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
        const image = e.target

        if(!document.startViewTransition) {
            openLightbox(image)
            return
        }

        image.style.viewTransitionName = 'selected-img'

        document.startViewTransition(() => {
            openLightbox(image)
        })


    })
})

lightboxImg.addEventListener('click', async (e) => {
    const image = e.target

    if(!document.startViewTransition) {
        closeLightbox(image)
        return
    }

    const animation = document.startViewTransition(() => {
        closeLightbox(image)
    })

    await animation.finished
    image.style.viewTransitionName = 'none'
})

