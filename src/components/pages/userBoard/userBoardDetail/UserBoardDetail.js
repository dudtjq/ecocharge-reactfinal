import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import './UserBoardDetail.scss';
import { Grid } from '@mui/material';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faFontAwesome,
  faChevronLeft,
  faPenToSquare,
  faSquareMinus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {
  API_BASE_URL,
  BOARD,
  BOARD_REPLY,
} from '../../../../config/host-config';
import handleRequest from '../../../../utils/handleRequest';
import axiosInstance from '../../../../config/axios-config';
import AuthContext from '../../../../utils/AuthContext';

const UserBoardDetail = () => {
  const navigate = useNavigate();
  const REQUEST_URL = API_BASE_URL + BOARD_REPLY;
  const { state } = useLocation();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [flag, setFlag] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const { onLogout } = useContext(AuthContext);
  const [reply, setReply] = useState({});

  // State for report modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reporterEmail, setReporterEmail] = useState('');
  const [reportReason, setReportReason] = useState({
    욕설: false,
    음란물: false,
    광고물: false,
    기타: false,
  });
  const [reporterText, setReporterText] = useState('');

  const [detailBoard, setDetailBoard] = useState({});

  const [searchParams] = useSearchParams();
  const boardNo = parseInt(searchParams.get('boardNo')) || 1;
  const replyNo = parseInt(searchParams.get('replyNo')) || 1;
  const userName = localStorage.getItem('USER_NAME');
  const userId = localStorage.getItem('USER_ID');
  const userRole = localStorage.getItem('ROLE');

  useEffect(() => {
    const boardDetailRenderingHandler = async () => {
      const boardDetail = await axios.get(
        `${API_BASE_URL}${BOARD}/detail?boardNo=${state}`,
      );
      console.log(boardDetail);
      setDetailBoard(boardDetail.data);
      console.log(state);
    };
    boardDetailRenderingHandler();
  }, [boardNo]);

  useEffect(() => {
    const replyRenderingHandler = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/ecocharge/board/reply/list/${boardNo}`,
        );
        console.log(response.data);
        setComments(response.data.replies); // 서버로부터 받은 댓글 데이터 설정
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    replyRenderingHandler();
  }, [flag]);

  const toggleReportModal = () => {
    setIsReportModalOpen(!isReportModalOpen);
  };

  const handleReplyDeleteClick = async (no) => {
    // 삭제처리함수
    console.log('삭제로직 작동');
    const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
    try {
      if (confirmed) {
        const response = await axios.delete(
          `${API_BASE_URL}/ecocharge/board/reply/${no}`,
          {
            headers: { 'content-type': 'application/json' },
            params: {
              userId,
            },
          },
        );
        const res = response.data;

        if (res) {
          window.alert('댓글이 삭제되었습니다');
          setFlag(1);
        } else {
          window.alert('이미 삭제된 댓글입니다.');
        }
      }
    } catch (error) {
      alert('다시 시도해주세요');
    }
  };

  const handleBoardDetailDelete = async () => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}${BOARD}/delete/${boardNo}`);
      alert('게시물이 삭제되었습니다.');
      navigate('/board');
    } catch (error) {
      handleRequest(error, onLogout, navigate);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const body = {
      replyText: commentText,
      replyWriter: userName,
      time: new Date().toLocaleString(),
      replyNo,
      boardNo,
      userId,
    };

    try {
      await axios.post(
        `${API_BASE_URL}/ecocharge/board/reply/${boardNo}`,
        body,
      );
      alert('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
    setFlag(1);
    setCommentText('');
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();

    const reportData = {
      reporterEmail,
      reportReason,
      reportDetails: reporterText,
    };

    console.log('Submitted report:', reportData);
    alert('신고되었습니다.');

    setIsReportModalOpen(false);
    setReporterEmail('');
    setReportReason({
      욕설: false,
      음란물: false,
      광고물: false,
      기타: false,
    });
    setReporterText('');
  };

  return (
    <Grid className='UBDcontainer'>
      <div className='backUserBoard' onClick={() => navigate('/board')}>
        <FontAwesomeIcon icon={faChevronLeft} /> &nbsp;Back
      </div>
      <h1 className='UBDcontainerTitle'>게시글</h1>
      <Grid
        className='btnBoxes'
        style={{
          width: '70%',
          margin: '0 auto 10px',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        {detailBoard.userId === userId ||
          (userRole === 'ADMIN' && (
            <Grid
              className='boardDetailDeleteBtn'
              onClick={handleBoardDetailDelete}
            >
              <div className='deletement'>
                삭제하기&nbsp;
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </Grid>
          ))}
        <Grid className='accuseBtnBox' onClick={toggleReportModal}>
          <div className='accuseText'>
            신고하기&nbsp;
            <FontAwesomeIcon
              icon={faFontAwesome}
              className='accuseBtn'
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Grid>
      </Grid>
      <Card className='UBD-card-container'>
        <Grid className='UserBoardInfo'>
          <div className='BoardInfoDetail'>글번호: {boardNo}</div>
          <div className='BoardInfoDetail'>작성자: {detailBoard.bwriter}</div>
          <div className='BoardInfoDetail'>
            작성일: {detailBoard.createDate}
          </div>
          <div className='BoardInfoDetail'>조회수: {detailBoard.viewCount}</div>
        </Grid>
        {detailBoard.bprofileImage != null && (
          <CardImg
            className='UBDcardIMG'
            alt='Card image cap'
            src={detailBoard.bprofileImage}
            top
            width='100%'
          />
        )}
        {detailBoard.bprofileImage != null ? (
          <CardBody className='UBDcardBody'>
            <CardTitle tag='h5' className='UBDcardTitle'>
              {detailBoard.btitle}
            </CardTitle>
            <CardText>{detailBoard.bcontent}</CardText>
          </CardBody>
        ) : (
          <CardBody
            className='UBDcardBody'
            style={{
              height: '400px',
            }}
          >
            <CardTitle tag='h5' className='UBDcardTitle'>
              {detailBoard.btitle}
            </CardTitle>
            <CardText>{detailBoard.bcontent}</CardText>
          </CardBody>
        )}
      </Card>

      {/* 좋아요 및 싫어요 버튼 */}
      <Card className='UBD-card-container2'>
        <CardBody>
          <Grid className='likeDislikeContainer'>
            <Button className='goodBtn' color='primary' onClick={handleLike}>
              <FontAwesomeIcon icon={faThumbsUp} /> {likes}
            </Button>
            <Button
              className='badBtn'
              color='danger'
              onClick={handleDislike}
              style={{ marginLeft: '10px' }}
            >
              <FontAwesomeIcon icon={faThumbsDown} /> {dislikes}
            </Button>
          </Grid>
        </CardBody>
      </Card>

      {/* 댓글 목록 */}
      <Card className='UBD-card-container'>
        <CardBody>
          <CardTitle tag='h5' style={{ fontWeight: '550', color: 'black' }}>
            댓글
          </CardTitle>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.replyNo} className='comment'>
                <CardText>
                  <strong>{comment.replyWriter}</strong>
                </CardText>
                <CardText>{comment.replyDate}</CardText>
                <CardText>
                  <small className='text-muted'>{comment.replyText}</small>
                </CardText>
                {comment.userId === userId || userRole === 'ADMIN' ? (
                  <div
                    className='mqlistDeleteBtn'
                    onClick={() => handleReplyDeleteClick(comment.replyNo)}
                  >
                    <FontAwesomeIcon icon={faSquareMinus} />
                  </div>
                ) : null}

                <hr />
              </div>
            ))
          ) : (
            <CardText>댓글이 없습니다.</CardText>
          )}
        </CardBody>
      </Card>

      {/* 댓글 작성 폼 */}
      <Card className='UBD-card-container'>
        <CardBody className='UBD-container-form'>
          <Form onSubmit={handleCommentSubmit}>
            <FormGroup>
              <Label
                for='commentAuthor'
                style={{ fontWeight: 'bold', color: 'black' }}
              >
                {userName != null ? userName : '작성자'}
              </Label>
              <Input
                type='text'
                name='author'
                id='commentAuthor'
                value={localStorage.getItem('USER_NAME') || ''}
                readOnly={true}
              />
            </FormGroup>
            <FormGroup>
              <Label for='commentText' style={{ fontWeight: 'bold' }}>
                댓글 작성
              </Label>
              <Input
                type='textarea'
                name='comment'
                id='commentText'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='댓글을 입력해주세요.'
              />
            </FormGroup>
            <Grid className='mentSubmitBtnBox'>
              <Button className='mentSubmitBtn' type='submit'>
                댓글 등록
              </Button>
            </Grid>
          </Form>
        </CardBody>
      </Card>

      {/* Report modal */}
      {isReportModalOpen && (
        <Card
          className='report-modal'
          style={{
            zIndex: 9999,
            width: '400px',
            position: 'absolute',
            top: '403px',
            right: '40px',
          }}
        >
          <CardBody style={{ width: '400px' }}>
            <CardTitle tag='h5'>신고하기</CardTitle>
            <Form onSubmit={handleSubmitReport}>
              <FormGroup>
                <Label>신고 사유</Label>
                <FormGroup check>
                  <Label check>
                    <Input
                      type='checkbox'
                      checked={reportReason['욕설']}
                      onChange={(e) =>
                        setReportReason({
                          ...reportReason,
                          욕설: e.target.checked,
                        })
                      }
                    />{' '}
                    욕설
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type='checkbox'
                      checked={reportReason['음란물']}
                      onChange={(e) =>
                        setReportReason({
                          ...reportReason,
                          음란물: e.target.checked,
                        })
                      }
                    />{' '}
                    음란물
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type='checkbox'
                      checked={reportReason['광고물']}
                      onChange={(e) =>
                        setReportReason({
                          ...reportReason,
                          광고물: e.target.checked,
                        })
                      }
                    />{' '}
                    광고물
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type='checkbox'
                      checked={reportReason['기타']}
                      onChange={(e) =>
                        setReportReason({
                          ...reportReason,
                          기타: e.target.checked,
                        })
                      }
                    />{' '}
                    기타
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label for='reporterText' style={{ marginTop: '10px' }}>
                    기타
                  </Label>
                  <Input
                    type='text'
                    name='text'
                    id='reporterText'
                    value={reporterText}
                    onChange={(e) => setReporterText(e.target.value)}
                    placeholder='내용을 입력해주세요.'
                  />
                </FormGroup>
              </FormGroup>
              <Button type='submit'>신고 제출</Button>
            </Form>
          </CardBody>
        </Card>
      )}
    </Grid>
  );
};

export default UserBoardDetail;
