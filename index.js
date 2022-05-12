const XHR = (method, url, params = {}) => {
    //api 요청 방식 내가 이해해야하는 부분
    return new Promise((resolve, reject) => {
        try {
            const request = new XMLHttpRequest()
            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE) {
                    resolve(request.response)
                }
            }
            request.open(method, url, true)
            request.setRequestHeader('Content-Type', 'application/json')
            request.send(JSON.stringify(params))
        } catch (e) {
            console.log(e)
        }
    })
}

const listingArticle = async () => {
    const data = await XHR('get', 'http://localhost:3714/')
    const reconstructions = JSON.parse(data)
    reconstructions.sort((a, b) => {
        return a.timestamp - b.timestamp
    })

    for (const reconstruction of reconstructions) {
        const date = new Date(reconstruction.timestamp)

        const article = document.createElement('article')
        article.dataset.index = `${reconstruction.index}`
        const titleDiv = document.createElement('div')
        titleDiv.className = 'title'

        const titleLabel = document.createElement('label')
        titleLabel.innerText = reconstruction.title
        titleDiv.append(titleLabel)

        const infoDiv = document.createElement('div')
        infoDiv.className = 'info'

        const authorLabel = document.createElement('label')
        authorLabel.className = 'author'
        authorLabel.innerText = reconstruction.author

        const timeLabel = document.createElement('date')
        timeLabel.className = 'write_time'
        timeLabel.innerText = date.toLocaleString('ko-KR', {
            timeZone: 'ASIA/SEOUL',
        })

        const deleteA = document.createElement('a')
        deleteA.setAttribute(
            'onclick',
            `deleteArticle(${reconstruction.index})`
        )
        deleteA.innerText = '삭제'

        infoDiv.append(authorLabel, timeLabel, deleteA)

        const contentsDiv = document.createElement('div')
        contentsDiv.classList.add('contents')
        contentsDiv.innerHTML = reconstruction.contents

        article.append(titleDiv, infoDiv, contentsDiv)

        const section = document.querySelector('section')
        const articleLatest = section.querySelector('article')
        section.insertBefore(article, articleLatest)
    }
}

const insertArticle = async () => {
    const inputTitle = document.querySelector('input[name="title"]')
    const inputContents = document.querySelector('textarea')
    const inputAuthor = document.querySelector('input[name="author"]')
    const inputPassword = document.querySelector('input[name="password"]')
    const inputSubmit = document.querySelector('input[type="submit"]')

    const title = inputTitle.value
    const contents = inputContents.value.replace(/\n/g, '<br />')
    const author = inputAuthor.value
    const password = inputPassword.value
    const timestamp = new Date().getTime()
    if (!title || !contents || !author || !password) {
        alert('입력되지 않은 항목이 있습니다!')
        return
    }

    inputTitle.setAttribute('disabled', 'disabled')
    inputContents.setAttribute('disabled', 'disabled')
    inputAuthor.setAttribute('disabled', 'disabled')
    inputPassword.setAttribute('disabled', 'disabled')
    inputSubmit.setAttribute('disabled', 'disabled')

    await XHR('post', 'http://localhost:3714/', {
        title: title,
        author: author,
        password: password,
        contents: contents,
        timestamp: timestamp,
    })
}

const deleteArticle = async (selectedIndex) => {
    let isSuccess
    let errorMsg
    const password = prompt('비밀번호를 입력해주세요.')
    const response = await XHR('delete', 'http://localhost:3714/', {
        index: selectedIndex,
        password: password,
    })
    const reResponse = JSON.parse(response)
    if (reResponse.success === true) {
        isSuccess = true
    } else {
        errorMsg = reResponse.errorMsg
    }

    if (!isSuccess) {
        alert(
            `다음과 같은 에러가 발생하여 게시물을 지우지 못했습니다:\n${errorMsg}`
        )
    }
}

;(async () => {
    await listingArticle()
})()

//-- 수정 전 코드
// const XHR = (method, url, params = {}) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const request = new XMLHttpRequest()
//             request.onreadystatechange = () => {
//                 if (request.readyState === XMLHttpRequest.DONE) {
//                     resolve(request.response)
//                 }
//             }
//             request.open(method, url, true)
//             request.setRequestHeader('Content-Type', 'application/json')
//             request.send(JSON.stringify(params))
//         } catch (e) {
//             console.log(e)
//         }
//     })
// }

// const listingArticle = async () => {
//     const data = await XHR('get', 'http://localhost:3714/')
//     const reconstructions = JSON.parse(data)
//     reconstructions.sort((a, b) => {
//         //timestamp를  기준으로 정렬
//         return a.timestamp - b.timestamp
//     })

//     for (const reconstruction of reconstructions) {
//         const date = new Date(reconstruction.timestamp)

//         const article = document.createElement('article')
//         article.dataset.index = `${reconstruction.index}` //이거 콘솔 찍어봐
//         const titleDiv = document.createElement('div')
//         titleDiv.className = 'title'

//         const titleLabel = document.createElement('label')
//         titleLabel.innerText = reconstruction.title
//         titleDiv.append(titleLabel)

//         const infoDiv = document.createElement('div')
//         infoDiv.className = 'info'

//         const authorLabel = document.createElement('label')
//         authorLabel.className = 'author'
//         authorLabel.innerText = reconstruction.author

//         const timeLabel = document.createElement('date')
//         timeLabel.className = 'write_time'
//         timeLabel.innerText = date.toLocaleString('ko-KR', {
//             timeZone: 'ASIA/SEOUL',
//         })

//         const deleteA = document.createElement('a')
//         deleteA.setAttribute(
//             'onclick',
//             `deleteArticle(${reconstruction.index})`
//         )
//         deleteA.innerText = '삭제'

//         infoDiv.append(authorLabel, timeLabel, deleteA)

//         const contentsDiv = document.createElement('div')
//         contentsDiv.classList.add('contents')
//         contentsDiv.innerHTML = reconstruction.contents

//         article.append(titleDiv, infoDiv, contentsDiv)

//         const section = document.querySelector('section')
//         const articleLatest = section.querySelector('article')
//         section.insertBefore(article, articleLatest)
//     }
// }

// const insertArticle = async () => {
//     const inputTitle = document.querySelector('input[name="title"]')
//     const inputContents = document.querySelector('textarea')
//     const inputAuthor = document.querySelector('input[name="author"]')
//     const inputPassword = document.querySelector('input[name="password"]')
//     const inputSubmit = document.querySelector('input[type="submit"]')

//     const title = inputTitle.value
//     const contents = inputContents.value.replace(/\n/g, '<br />')
//     const author = inputAuthor.value
//     const password = inputPassword.value
//     const timestamp = new Date().getTime()
//     if (!title || !contents || !author || !password) {
//         alert('입력되지 않은 항목이 있습니다!')
//         return
//     }

//     inputTitle.setAttribute('disabled', 'disabled')
//     inputContents.setAttribute('disabled', 'disabled')
//     inputAuthor.setAttribute('disabled', 'disabled')
//     inputPassword.setAttribute('disabled', 'disabled')
//     inputSubmit.setAttribute('disabled', 'disabled')

//     await XHR('post', 'http://localhost:3714/', {
//         title: title,
//         author: author,
//         password: password,
//         contents: contents,
//         timestamp: timestamp,
//     })
// }

// const deleteArticle = async (selectedIndex) => {
//     let isSuccess //성공 여부 담기
//     let errorMsg
//     const password = prompt('비밀번호를 입력해주세요.') //프롬프트 창
//     const response = await XHR('delete', 'http://localhost:3714/', {
//         index: selectedIndex,
//         password: password,
//     })
//     const reResponse = JSON.parse(response)
//     console.log('response', response)
//     if (reResponse.success === true) {
//         //이쪽 해석하기
//         isSuccess = true
//     } else {
//         errorMsg = reResponse.errorMsg
//     }

//     if (isSuccess === true) {
//         Object.keys(document.getElementsByTagName('article')).forEach((k) => {
//             const object = document.getElementsByTagName('article')[k]
//             console.log('object', object)
//             if (object.dataset.index == selectedIndex) {
//                 object.remove()
//             }
//         })
//     } else {
//         alert(
//             `다음과 같은 에러가 발생하여 게시물을 지우지 못했습니다:\n${errorMsg}`
//         )
//     }
// }

// ;(async () => {
//     await listingArticle() //async await는 async 안에서만 쓸수 있다. 그래서 괄호로 감쌈
// })()
//익명함수를 즉시 실행할 때 ; 붙여준다. 원래는 js가 알아서 ; 붙여줌. 앞으론 볼일 없닫

// // API를 호출하는 General 코드를 작성하라
// const XHR = (method, url, params = {}) => {
//     //xhr 함수를 호출할 때, method, url, params를 받는다.
//     return new Promise((resolve, reject) => {
//         //
//         try {
//             const request = new XMLHttpRequest() //js 통신 라이브러리. 서버와 상호작용. 전체 페이지의 새로고침 없이도 URL로 부터 데이터를 받아올 수 있다.
//             request.onreadystatechange = () => {
//                 //readyState 어트리뷰트가 변경될때마다 호출되는 event handler. 하나의 값이야. 함수 등록.
//                 if (request.readyState === 4) {
//                     //준비상태가 4로 바뀌었을 때
//                     resolve(request.response) //서버에서 받아온 값이다. resolve로 감싸서 반환. promise에서 resolve는 성공적으로 코드를 실행했을 때 반환하는 것. 즉 여기서는 서버에서 받아온 값을 반환한다.
//                 }
//             }
//             request.open(method, url) //XMLHttpRequest.open() 메소드)get post put delete 같은거)와 url 등록
//             request.setRequestHeader('Content-Type', 'application/json') //HTTP요청 헤더의 값을 설정. json으로.
//             request.send(JSON.stringify(params)) //params는 오브젝트 형태로 온다. stringify 메소드는 json 객체를 String 객체로 변환시켜 줍니다
//             //send를 open으로 보냄
//             //완료된 상태면 request에 response넣기
//         } catch (e) {
//             console.log('error', e) //로직 성공적으로 수행 못했을 때 콘솔에 에러 띄우기
//         }
//     })
// }

// // ----------------- ENTER YOUR CODE HERE -----------------

// // 작성한 XHR 함수를 이용하여 게시물 읽기  API(api도 함수의 일종)함수 호출하는 코드를 작성하라
// // index.html 에 이미 적혀있는 SAMPLE처럼, section 태그 안에 게시물을 article 태그로 하나씩 작성되게 하라
// // 만들어지는 article 태그의 DOM 구조 및 내부 속성은 SAMPLE과 동일하게 하라
// // 게시물은 시간 역순으로 나타나게 하라

// const listingArticle = async () => {
//     try {
//         const value = await XHR('get', 'http://localhost:3714/', {}) //비동기 함수 xhr의 반환값, request.response을 value에 넣는다.
//         const articleArray = JSON.parse(value) //string 객체를 json으로 변환하기
//         for (article of articleArray) {
//             console.log('articleArray : ', article)
//             //article 들을 넣을 section 자리
//             const place = document.querySelector('section')
//             //article 태그 만들기
//             const appArt = document.createElement('article')
//             //section에 article 넣기
//             place.appendChild(appArt)

//             //제목 넣을 div 만들기
//             const appTitle = document.createElement('div')
//             //div의 클래스는 title이라고 준다.
//             appTitle.setAttribute('class', 'title')
//             //article에 제목 div 추가
//             appArt.appendChild(appTitle)

//             //label 생성
//             const titleLabel = document.createElement('label')
//             //기사의 제목을 넣는다.
//             titleLabel.innerHTML = article.title
//             appTitle.appendChild(titleLabel)

//             //info div추가
//             const appInfo = document.createElement('div')
//             appInfo.setAttribute('class', 'info')
//             //info div를  article 안에 넣기
//             appArt.appendChild(appInfo)

//             //label
//             const infoLabel1 = document.createElement('label')
//             infoLabel1.innerHTML = article.author
//             appInfo.appendChild(infoLabel1)

//             //label
//             const infoLabel2 = document.createElement('label')
//             infoLabel2.innerHTML = article.app_write_time
//             appInfo.appendChild(infoLabel2)

//             const app_write_time = document.createElement('label')
//             timestamp = new Date(article.timestamp)
//             console.log(timestamp)
//             //const timestamp = (article.timestamp + datetime) / 1000 //어떻게 2022.1.25 이런 식으로 불러오지???
//             appInfo.appendChild(app_write_time)

//             const app_a = document.createElement('a')
//             app_a.innerText = '삭제'
//             appInfo.appendChild(app_a)
//             app_a.setAttribute('onclick', 'deleteArticle(article.index)')

//             const appContents = document.createElement('div')
//             appContents.setAttribute('class', 'contents')
//             appContents.innerHTML = article.contents
//             appArt.appendChild(appContents)
//         }

//         // articleArray.sort((a, b) => {
//         //     return a.timestamp - b.timestamp
//         // })
//         //sort : a가 b보다 작은 경우 음수 값 리턴
//         //양수 값일 때 자리 바꿈.
//     } catch (e) {
//         console.log('에러', e)
//     }
// }

// async function insertArticle(event) {
//     event.preventDefault()
//     const inputTitle = document.querySelector('input[name="title"]') //[]어트리뷰트
//     const inputContents = document.querySelector('textarea')
//     const inputAuthor = document.querySelector('input[name="author"]')
//     const inputPassword = document.querySelector('input[name="password"]')
//     const inputSubmit = document.querySelector('input[type="button"]')
//     const datetime = new Date()

//     const title = inputTitle.value
//     const contents = inputContents.value.replace(/\n/g, '<br />')
//     const author = inputAuthor.value
//     const password = inputPassword.value
//     const timestamp = +datetime / 1000

//     if (!title || !contents || !author || !password) {
//         alert('입력되지 않은 항목이 있습니다!')
//         return
//     }
//     //사용자가 1개 게시글 작성하면 서버로 갈때까지 수정 못하게, 추가 요청 못하게 막기??????
//     inputTitle.setAttribute('disabled', 'disabled')
//     inputContents.setAttribute('disabled', 'disabled')
//     inputAuthor.setAttribute('disabled', 'disabled')
//     inputPassword.setAttribute('disabled', 'disabled')
//     inputSubmit.setAttribute('disabled', 'disabled')

//     // // ----------------- ENTER YOUR CODE HERE -----------------

//     // // 작성한 XHR 함수를 이용하여 게시글 작성 Insert Article API를 호출하는 코드를 작성하라
//     // // 호출 후 반환된 게시물 번호를 articleIndex 변수에 담게 하라

//     // // --------------------------------------------------------

//     await XHR('post', 'http://localhost:3714/', {
//         title, //키와 벨류의 이름이 똑같은 경우 이렇게 생략 가능
//         author: author,
//         password: password,
//         contents: contents,
//         timestamp: timestamp,
//     })
// }
// //여기까지 insertArticle()

// async function deleteArticle(selectedIndex) {
//     //원래 코드
//     let isSuccess = false //성공했는지 여부. false 전제로 가야
//     let errorMsg
//     const password = prompt('비밀번호를 입력해주세요.')

//     // ----------------- ENTER YOUR CODE HERE -----------------

//     // 작성한 XHR 함수를 이용하여 게시글 삭제 Delete Article API를 호출하는 코드 작성하라
//     // 성공시 isSuccess 변수의 값을 (Boolean)true로 변경하라
//     // 실패시 에러 메시지를 errorMsg 변수에 담게 하라

//     // --------------------------------------------------------

//     await XHR('delete', 'http://localhost:3714/', {
//         index: selectedIndex, //오브젝트니까, 키는 ,값은 프론트에서 넣어줄 값
//         password: password,
//     })

//     //프론트에서 제거
//     if (isSuccess) {
//         Object.keys(document.getElementsByTagName('article')).forEach((k) => {
//             //오브젝트 키즈

//             const object = document.getElementsByTagName('article')[k]
//             if (object.dataset.index == selectedIndex) {
//                 object.remove()
//             }
//         })
//     } else {
//         alert(
//             `다음과 같은 에러가 발생하여 게시물을 지우지 못했습니다:\n${errorMsg}`
//         )
//     }
// }
// //여기까지 deleteArticle
// console.log(document.getElementsByTagName('article'))
// console.log(Object.keys(document.getElementsByTagName('article')))
// ;(async () => {
//     await listingArticle()
// })()
