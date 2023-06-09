import { useState, useEffect } from 'react';
import styles from './BoardCollection.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useDeleteCollection from './DeleteCollection';
import useCarousel from './Carousel';
// import usePublicCollection from './PublicCollection';

const myvisioboardAPI = 'http://localhost:9999/collection';
// const finalVisioboardAPI = /api/v1/visionboards

function BoardCollection() {
  const [collection, setCollection] = useState({
    img: [],
    title: [],
    id: [],
  });

  // db에서 컬렉션 정보 불러오기
  // --- 코치님 작성해주신 코드 시작 ---
  // const fetchResult = fetch('/api');
  // if (!fetchResult.error) {
  //   console.log('api 통신 성공');
  // }
  // if (fetchResult.error && fetchResult.error.statusCode === 401) {
  //   if (fetchResult.error.statusCode === 401) {
  //     // 인증실패일 경우 다시 로그인을 유도
  //     console.log('사용자 인증 오류');
  //     localStorage.removeItem('isLogin');
  //     navigate('/');
  //   } else {
  //     console.log('나머지 오류');
  //     alert('에러남');
  //   }
  // }
  // // --- 코치님 작성해주신 코드 끝 ---

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/api/v1/visionboards');

  //       if (!response.ok) {
  //         throw new Error('네트워크 응답이 정상적이지 않습니다');
  //       }

  //       const items = await response.json();

  //       // API 통신 성공 로그
  //       console.log('api 통신 성공');

  //       if (items.error && items.error.statusCode === 401) {
  //         console.log('사용자 인증 오류');
  //         localStorage.removeItem('isLogin');
  //         navigate('/');
  //       } else if (items.error) {
  //         console.log('나머지 오류');
  //         alert('에러남');
  //       } else {
  //         const imgPaths = items.map((item) => item.imagePath);
  //         const imgTitles = items.map((item) => item.title);
  //         const imgIds = items.map((item) => item.id);
  //         setCollection({
  //           img: imgPaths,
  //           title: imgTitles,
  //           id: imgIds,
  //         });
  //       }
  //     } catch (err) {
  //       console.error('비동기 처리 중 오류가 발생했습니다:', err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    try {
      fetch(myvisioboardAPI)
        .then((response) => {
          if (!response.ok) {
            throw new Error('네트워크 응답이 정상적이지 않습니다');
          }
          return response.json();
        })
        .then((items) => {
          console.log('GET으로 받아온 items:', items);
          const imgPaths = items.map((item) => item.imagePath);
          const imgTitles = items.map((item) => item.title);
          const imgIds = items.map((item) => item.id);
          setCollection({
            img: imgPaths,
            title: imgTitles,
            id: imgIds,
          });
        });
    } catch (err) {
      console.error('비동기 처리 중 오류가 발생했습니다:', err);
    }
  }, []);

  // 컬렉션 상세보기 페이지 넘어가기
  const navigate = useNavigate();
  const handleBtnForBoardDetail = (id) => {
    navigate(`/myvisionboardgrid/${id}`);
    console.log('상세보기클릭', id);
  };

  // useCarousel 커스텀훅
  // useDeleteCollection 커스텀훅 보다 순서상 먼저 선언되어야 함
  const {
    setIndex,
    index,
    increaseClick,
    decreaseClick,
    x,
    morePrevImg,
    PrevImg,
    NextImg,
    moreNextImg,
  } = useCarousel(collection);

  // useDeleteCollection 커스텀훅 클릭 핸들러
  const [handleDeleteButtonClick, loading] = useDeleteCollection(
    collection,
    setCollection,
    myvisioboardAPI,
    setIndex
  );

  //usePublicCollection 커스텀 훅
  // const [
  //   handleBtnForPublicOpen,
  //   handleBtnForPublicClose,
  //   handleBtnForPublicPage,
  //   // ] = usePublicCollection(setCollection, collection);
  // ] = usePublicCollection(setCollection, collection);

  // 리턴
  return (
    <div className={styles.wrapper}>
      {/* 보유한 컬렉션 없으면 문구 제외 모든 기능 숨김 */}
      {collection.img.length === 0 ? (
        <div className={styles.noCollection}>
          보유한 컬렉션이 없습니다. 비전보드를 만들어보세요!
        </div>
      ) : (
        <>
          {/* 삭제중일 때 오버레이 */}
          {loading && (
            <div className={styles.overlay}>
              <p className={styles.loadingText}>삭제 중...</p>
            </div>
          )}
          {/* 왼쪽 버튼 */}
          <button
            className={styles.leftButton}
            onClick={decreaseClick}
            // 첫번째 페이지 도달 시 버튼 숨김
            style={{ display: index === 0 ? 'none' : 'block' }}
          >
            <FiChevronLeft />
          </button>

          {/* 오른쪽 버튼 */}
          <button
            className={styles.rightButton}
            onClick={increaseClick}
            // 마지막 페이지 도달 시 버튼 숨김
            style={{
              display: index === collection.img.length - 1 ? 'none' : 'block',
            }}
          >
            <FiChevronRight />
          </button>

          {/* 가로 정렬 등 전체 스타일 시작  */}
          <div className={styles.row} key={index}>
            {/* 전전 슬라이드에 적용 */}
            <div className={styles.container}>
              <img
                className={styles.priviewImg}
                src={collection.img[morePrevImg]}
              ></img>
            </div>

            {/* 전 슬라이드에 적용 */}
            <div className={styles.container}>
              <img
                className={styles.priviewImg}
                src={collection.img[PrevImg]}
              ></img>
            </div>

            {/* 현재 슬라이드 시작 */}
            <div className={styles.imgWrapper}>
              <img className={styles.img} src={collection.img[index]}></img>

              {/* 이미지 설명 박스 */}
              <div className={styles.imgDes}>
                <div className={styles.title}>{collection.title[index]}</div>
              </div>
            </div>
            {/* 현재 슬라이드  끝 */}

            {/* 다음 슬라이드에 적용 */}
            <div className={styles.container}>
              <img
                className={styles.priviewImg}
                src={collection.img[NextImg]}
              ></img>
            </div>

            {/* 다다음 슬라이드에 적용 */}
            <div className={styles.container}>
              <img
                className={styles.priviewImg}
                src={collection.img[moreNextImg]}
              ></img>
            </div>
          </div>

          {/* 가로 정렬 등 전체 스타일 끝  */}

          {/* 현재 슬라이드 위치 표시 */}
          <div className={styles.dotWrapper}>
            {collection.img.map((_, idx) => (
              <div
                key={idx}
                className={
                  styles.dot + (idx === index ? ' ' + styles.active : '')
                }
              ></div>
            ))}
          </div>

          {/* 버튼박스 */}
          <div className={styles.buttonBox}>
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteButtonClick(index)}
            >
              컬렉션 삭제
            </button>

            <button
              className={styles.detailButton}
              onClick={() => handleBtnForBoardDetail(collection.id[index])}
            >
              컬렉션 상세보기
            </button>

            {/* <button
              className={styles.publicOpenButton}
              onClick={() =>
                handleBtnForPublicOpen(
                  collection.id[index],
                  collection.title[index],
                  collection.img[index]
                )
              }
            >
              컬렉션 공개
            </button>

            <button
              className={styles.publicCloseButton}
              onClick={() =>
                handleBtnForPublicClose(
                  collection.id[index],
                  collection.title[index],
                  collection.img[index]
                )
              }
            >
              컬렉션 비공개
            </button> */}
          </div>

          {/* 현재 공개 컬렉션 정보 */}
          {/* <div className={styles.buttonBox2}>
            <div className={styles.publicCollectionInfo}>
              공개 설정한 컬렉션 :<div id="collectionInfo"></div>
            </div>
          </div>
          <div className={styles.publicCollectionInfo2}>
            *공개 컬렉션은 최대 1개까지 설정 가능
          </div> */}
        </>
      )}
    </div>
  );
}

export default BoardCollection;
