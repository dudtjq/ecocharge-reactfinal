import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  InputGroup,
  Input,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import './QnAList.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faPenToSquare,
  faSquareMinus,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL, QNA } from '../../../../config/host-config';
import axiosInstance from '../../../../config/axios-config';
import PageButton from '../../pageButton/PageButton';
const QnAList = () => {
  const requestUrl = API_BASE_URL + QNA;
  const categories = [
    { name: '전체', value: 'all' },
    { name: '홈페이지', value: 'homePage' },
    { name: '전기차 충전소', value: 'chargeSpot' },
    { name: '기타', value: 'etc' },
  ];
  const [searchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [qnaData, setQnaData] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchTypeDropdownOpen, setSearchTypeDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [filteredQnaData, setFilteredQnaData] = useState([]);
  const [pageMaker, setPageMaker] = useState({});
  const [pageButtonCount, setPageButtonCount] = useState(0);
  const [pageNo, setPageNo] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [modalOpen, setModalOpen] = useState(false); // 답변 모달 창 상태 추가
  const [selectedQna, setSelectedQna] = useState(null); // 선택된 질문 상태 추가
  const [answer, SetAnswer] = useState(''); //작성한 답변 값 저장 상태
  const [formData, setFormData] = useState({});
  const [showansbox, setshowAnsBox] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('USER_ID');
  const userRole = localStorage.getItem('ROLE');

  const toggleCategoryDropdown = () =>
    setCategoryDropdownOpen((prevState) => !prevState);
  const toggleSearchTypeDropdown = () =>
    setSearchTypeDropdownOpen((prevState) => !prevState);
  const toggleModal = () => setModalOpen((prevState) => !prevState);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
  };

  const handleAnswerClick = async (qnaNo) => {
    const res = await axiosInstance.get(requestUrl + `/${qnaNo}`);
    setSelectedQna(res.data); // 선택된 질문 설정
    toggleModal(); // 모달 창 열기
  };

  // const handleTdClick = () => {};
  const handleQNADeleteClick = async (no) => {
    // 삭제처리함수
    console.log('삭제로직 작동');
    const confirmed = window.confirm('게시글을 삭제하시겠습니까?');
    try {
      if (confirmed) {
        const response = await axios.delete(`${API_BASE_URL}${QNA}/${no}`, {
          headers: { 'content-type': 'application/json' },
          params: {
            userId: localStorage.getItem('USER_ID'),
          },
        });
        const res = response.data;

        if (res) {
          window.alert('게시글이 삭제되었습니다');
          qnaListRenderingHandler();
        } else {
          window.alert('이미 삭제된 게시글입니다.');
        }
      }
    } catch (error) {
      alert('다시 시도해주세요');
    }
  };
  const pageButtonClickHandler = (no) => {
    setPageNo(no);
    if (location.pathname && pageNo !== no) {
      navigate(`/qnalist?page=${no}`, { state: { page: no } });
    }
  };

  const qnaListRenderingHandler = async () => {
    let url = `${requestUrl}?page=${pageNo}`;
    // const userId = localStorage.getItem('USER_ID');
    // const userRole = localStorage.getItem('ROLE');
    // if (userId) {
    //   url += `&userId=${userId}`;
    //   url += `&userRole=${userRole}`;
    // }

    const res = await axios.get(url);
    setQnaData(res.data.qnas);
    setPageMaker(res.data.pageMaker);
    setPageButtonCount(res.data.pageMaker.end);
    filterQnaData(res.data.qnas); // 초기 데이터 설정
    console.log(res.data);
  };

  useEffect(() => {
    qnaListRenderingHandler();
  }, [location.state, pageNo, answer]);

  useEffect(() => {
    const handleBackButton = (event) => {
      if (event.state.usr !== null) {
        setPageNo(event.state.usr.page);
      } else {
        setPageNo(1);
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  useEffect(() => {
    filterQnaData(qnaData); // qnaData가 변경될 때마다 필터링 적용
  }, [selectedCategory, searchQuery, searchType, qnaData]);

  const filterQnaData = (data) => {
    let filteredData = data || qnaData;

    if (selectedCategory !== '전체') {
      filteredData = filteredData.filter(
        (qna) => qna.qcategory === selectedCategory,
      );
    }

    if (searchQuery) {
      filteredData = filteredData.filter((qna) => {
        if (searchType === 'title') {
          return qna.qtitle.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === 'writer') {
          return qna.qwriter.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true; // 이 부분은 선택적으로 추가할 수 있습니다.
      });
    }

    setFilteredQnaData(filteredData);
  };

  // 답변 모달 창 내용
  const renderAnswerModal = () => (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      style={{ marginTop: '200px' }}
    >
      <ModalHeader toggle={toggleModal} style={{ fontWeight: 'bold' }}>
        답변 작성
      </ModalHeader>
      <ModalBody>
        <div>질문: {selectedQna?.qtitle}</div>
        <InputGroup style={{ marginTop: '10px' }}>
          <InputGroupText>답변:</InputGroupText>
          <Input
            type='textarea'
            name='qanswer'
            id='qanswer'
            placeholder='내용을 입력하세요'
            onChange={handleChange}
          />
        </InputGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          style={{ backgroundColor: '#0d1245', fontWeight: 'bold' }}
          onClick={handleAnswerSubmit}
        >
          작성 완료
        </Button>
        <Button
          color='secondary'
          onClick={toggleModal}
          style={{ fontWeight: 'bold' }}
        >
          취소
        </Button>
      </ModalFooter>
    </Modal>
  );
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value, // name이 'qanswer'인 경우, formData.qanswer에 사용자 입력 값이 설정됩니다.
      qnaNo: selectedQna.qnaNo,
    });
  };

  // 답변 작성 완료 핸들러
  const handleAnswerSubmit = async () => {
    try {
      const answerInput = document.getElementById('qanswer');
      console.log('selectqnano:', selectedQna.qnaNo);
      const qnaNo = selectedQna.qnaNo; // selectedQna에서 qnaNo 가져오기
      const body = JSON.stringify(formData);
      // 서버로 PATCH 요청 보내기
      const res = await axiosInstance.patch(`${requestUrl}/add/${qnaNo}`, body);
      console.log(res.data);
      console.log(res.data.qanswer);
      // 서버로부터 받은 응답 처리

      SetAnswer(res.data.qanswer);
      toggleModal(); // 성공 시 모달 닫기 등의 처리
      answerInput.value = '';
    } catch (error) {
      // 오류 처리
      console.error('Error adding answer:', error);
      // 필요한 오류 처리 로직 추가
    }
  };

  return (
    <div className='qnacontainer' style={{ padding: '20px' }}>
      <div className='goBeforePageBtnBox'>
        <div className='goBeforePageBtn1' onClick={() => navigate('/qna')}>
          <FontAwesomeIcon icon={faChevronLeft} /> &nbsp;Back
        </div>
      </div>
      <div className='qnatitle'>1 : 1 문의</div>
      <div className='comentbox'>
        <div className='comment-inner'>
          <div className='coment'>
            ●자주 발생하는 질문에 대하여서는 FAQ에 등록된 질문 및 답변내용을
            참조하여 주십시오.
          </div>
          <div className='coment'>●업무시간 : 9:00 ~ 18:00</div>
        </div>
        <div className='myqnaBtnbox'>
          <Button className='goAsk' onClick={() => navigate('/questionform')}>
            문의하기
          </Button>
          <Button
            className='goMyAskList'
            onClick={() =>
              navigate('/myquestionlist', {
                state: { myQuestionInfo: filteredQnaData },
              })
            }
          >
            내 문의내역
          </Button>
        </div>
      </div>
      <div
        className='dropdown-container'
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '0 auto',
          width: '80%',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Dropdown
          className='qnaListDropdown'
          isOpen={categoryDropdownOpen}
          toggle={toggleCategoryDropdown}
          style={{ marginRight: '10px' }}
        >
          <DropdownToggle caret>{selectedCategory}</DropdownToggle>
          <DropdownMenu>
            {categories.map((category) => (
              <DropdownItem
                key={category.value}
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Dropdown
          isOpen={searchTypeDropdownOpen}
          toggle={toggleSearchTypeDropdown}
        >
          <DropdownToggle caret>
            {searchType === 'title' ? '제목' : '작성자'}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => setSearchType('title')}>
              제목
            </DropdownItem>
            <DropdownItem onClick={() => setSearchType('writer')}>
              작성자
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <InputGroup
          className='search-bar'
          style={{ width: '40%', paddingTop: '20px' }}
        >
          <Input
            style={{ width: '100%' }}
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by ${searchType === 'title' ? '제목' : '작성자'}`}
          />
        </InputGroup>
      </div>
      <div className='qnaListContainer'>
        {filteredQnaData.map((qna) => (
          <div key={qna.qnaNo}>
            <div
              className='qnaListInnerBox'
              style={{
                cursor: 'pointer',
              }}
              onClick={() => setshowAnsBox(qna.qnaNo)}
            >
              <div className='qlistNum'>{qna.count}</div>
              <div className='qlistCategory'>{qna.qcategory}</div>
              <div className='qlistTitle'>{qna.qtitle}</div>
              <div className='qlistWriter'>{qna.qwriter}</div>
              <div className='qlistDate'>{qna.date}</div>
              {userRole === 'ADMIN' ? (
                <div
                  className='qlistAnswer'
                  onClick={() => handleAnswerClick(qna.qnaNo)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </div>
              ) : null}
              {qna.quserId === userId || userRole === 'ADMIN' ? (
                <div
                  className='mqlistDeleteBtn'
                  onClick={() => handleQNADeleteClick(qna.qnaNo)}
                >
                  <FontAwesomeIcon icon={faSquareMinus} />
                </div>
              ) : null}
            </div>
            {showansbox !== null && showansbox === qna.qnaNo && (
              <div
                className='ansbox'
                style={{
                  margin: '20px',
                  display: 'flex',
                  // backgroundColor: 'lightgray',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  padding: '20px',
                  alignItems: 'flexstart',
                  border: '1px solid gray',
                  backgroundColor: '#9EB1C51C',
                }}
              >
                <span
                  className='ansmark'
                  style={{
                    display: 'flex',
                    color: 'skyblue',
                    fontSize: '20px',
                    marginRight: '30px',
                    marginLeft: '10px',
                  }}
                >
                  A.
                </span>
                <div className='ans'>질문내용: {qna.qcontent}</div>
                <div className='ans'>답변내용: {qna.qanswer}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedQna && renderAnswerModal()}{' '}
      {/* 선택된 질문이 있을 때만 모달 렌더링 */}
      <div
        className='paging-container'
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '100px',
        }}
      >
        <PageButton
          pageMaker={pageMaker}
          buttonCount={pageButtonCount}
          clickHandler={pageButtonClickHandler}
          page={pageNo}
        />
      </div>
    </div>
  );
};

export default QnAList;
