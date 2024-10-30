import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { alertActions } from "store/slices/alertSlice";
import { HttpMethod } from "utils/httpMethods";
import useAPI from "../../hooks/useAPI";
import { ICourseResponse as ICourse } from "../../utils/interfaces";

/**
 * @author Suraj Raghu Kumar, on Oct, 2024 
 * @author Yuktasree Muppala on Oct, 2024
 * @author Harvardhan Patil on Oct, 2024
 */

// CopyCourse Component: Modal for copying a course.

interface ICopyCourse {
  courseData: ICourse;
  onClose: () => void;
}

const CopyCourse: React.FC<ICopyCourse> = ({ courseData, onClose }) => {
  // State and hook declarations
  const { data: copiedCourse, error: courseError, sendRequest: copyCourseRequest } = useAPI();
  const [show, setShow] = useState<boolean>(true);
  const [isCopying, setIsCopying] = useState<boolean>(false); // State to track copying process
  const dispatch = useDispatch();
  const courseId = courseData.id;
  // Function to initiate the course copy process
  const copyHandler = () => {
    setIsCopying(true); // Set copying state to true
    copyCourseRequest({ url: `/courses/${courseId}/copy`, method: HttpMethod.GET });
  };

  // Show error if any
  useEffect(() => {
    if (courseError) {
      dispatch(alertActions.showAlert({ variant: "danger", message: courseError }));
      setIsCopying(false); // Reset copying state on error
    }
  }, [courseError, dispatch]);

  // Close modal if course is copied
  useEffect(() => {
    if (copiedCourse?.status && copiedCourse?.status >= 200 && copiedCourse?.status < 300) {
      setShow(false);
      dispatch(
        alertActions.showAlert({
          variant: "success",
          message: `Course ${courseData.name} copied successfully!`,
        })
      );
      onClose();
    }
  }, [copiedCourse?.status, dispatch, onClose, courseData.name]);

  // Function to close the modal
  const closeHandler = () => {
    setShow(false);
    onClose();
  };

  // Render the CopyCourse modal
  return (
    <Modal show={show} onHide={closeHandler} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Copy Course</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>
          Are you sure you want to copy course <b>{courseData.name}?</b>
        </p>
        {isCopying && <Spinner animation="border" variant="primary" />}
        {courseError && <Alert variant="danger">{courseError}</Alert>} {/* Display error message */}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="outline-secondary" onClick={closeHandler}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={copyHandler} 
          disabled={isCopying} // Disable button while copying
        >
          {isCopying ? "Copying..." : "Copy"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CopyCourse;
