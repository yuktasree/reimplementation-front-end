import { Row as TRow } from "@tanstack/react-table";
import Table from "components/Table/Table";
import useAPI from "hooks/useAPI";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Row, Form, Spinner } from "react-bootstrap";
import { RiHealthBookLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { alertActions } from "store/slices/alertSlice";
import { RootState } from "../../store/store";
import { ICourseResponse, ROLE } from "../../utils/interfaces";
import { courseColumns as COURSE_COLUMNS } from "./CourseColumns";
import CopyCourse from "./CourseCopy";
import DeleteCourse from "./CourseDelete";
import { formatDate, mergeDataAndNamesAndInstructors } from "./CourseUtil";

// Courses Component: Displays and manages courses, including CRUD operations.
const Courses = () => {
  // Hooks for API requests
  const { error, isLoading, data: CourseResponse, sendRequest: fetchCourses } = useAPI();
  const { data: InstitutionResponse, sendRequest: fetchInstitutions } = useAPI();
  const { data: InstructorsResponse, sendRequest: fetchInstructors } = useAPI();
  
  const auth = useSelector((state: RootState) => state.authentication);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Filters for dates
  const [creationDateFilter, setCreationDateFilter] = useState("");
  const [updatedDateFilter, setUpdatedDateFilter] = useState("");
  
  // States for delete and copy confirmation modals
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{ visible: boolean; data?: ICourseResponse }>({ visible: false });
  const [showCopyConfirmation, setShowCopyConfirmation] = useState<{ visible: boolean; data?: ICourseResponse }>({ visible: false });

  // Fetch data on component mount and when modals close
  useEffect(() => {
    if (!showDeleteConfirmation.visible && !showCopyConfirmation.visible) {
      fetchCourses({ url: `/courses` });
      fetchInstitutions({ url: `/institutions` });
      fetchInstructors({ url: `/instructors` });
    }
  }, [fetchCourses, fetchInstitutions, fetchInstructors, location, showDeleteConfirmation.visible, showCopyConfirmation.visible]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      dispatch(alertActions.showAlert({ variant: "danger", message: error }));
    }
  }, [error, dispatch]);

  // Handlers for modal visibility
  const onDeleteCourseHandler = useCallback(() => setShowDeleteConfirmation({ visible: false }), []);
  const onCopyCourseHandler = useCallback(() => setShowCopyConfirmation({ visible: false }), []);
  
  // Handlers for navigating to edit and TA pages
  const onEditHandle = useCallback((row: TRow<ICourseResponse>) => navigate(`edit/${row.original.id}`), [navigate]);
  const onTAHandle = useCallback((row: TRow<ICourseResponse>) => navigate(`${row.original.id}/tas`), [navigate]);
  
  // Handlers for delete and copy actions
  const onDeleteHandle = useCallback((row: TRow<ICourseResponse>) => setShowDeleteConfirmation({ visible: true, data: row.original }), []);
  const onCopyHandle = useCallback((row: TRow<ICourseResponse>) => setShowCopyConfirmation({ visible: true, data: row.original }), []);
  
  // Define table columns using memoization
  const tableColumns = useMemo(() => COURSE_COLUMNS(onEditHandle, onDeleteHandle, onTAHandle, onCopyHandle), [onDeleteHandle, onEditHandle, onTAHandle, onCopyHandle]);
  
  // Prepare table data
  let tableData = useMemo(() => (isLoading || !CourseResponse?.data ? [] : CourseResponse.data), [CourseResponse?.data, isLoading]);
  const institutionData = useMemo(() => (isLoading || !InstitutionResponse?.data ? [] : InstitutionResponse.data), [InstitutionResponse?.data, isLoading]);
  const instructorData = useMemo(() => (isLoading || !InstructorsResponse?.data ? [] : InstructorsResponse.data), [InstructorsResponse?.data, isLoading]);

  tableData = mergeDataAndNamesAndInstructors(tableData, institutionData, instructorData);
  
  // Format table data dates
  const formattedTableData = tableData.map((item: any) => ({
    ...item,
    created_at: formatDate(item.created_at),
    updated_at: formatDate(item.updated_at),
  }));

  // Filtered table data based on date filters
  const filteredData = useMemo(() => {
    return formattedTableData.filter((item: any) => {
      const itemCreationDate = item.created_at?.split("T")[0];
      const itemUpdatedDate = item.updated_at?.split("T")[0];

      const matchesCreationDate = creationDateFilter ? itemCreationDate === creationDateFilter : true;
      const matchesUpdatedDate = updatedDateFilter ? itemUpdatedDate === updatedDateFilter : true;

      return matchesCreationDate && matchesUpdatedDate;
    });
  }, [formattedTableData, creationDateFilter, updatedDateFilter]);

  // Render the Courses component
  return (
    <>
      <Outlet />
      <main>
        <Container fluid className="px-md-4">
          <Row className="mt-md-2 mb-md-2">
            <Col className="text-center">
              <h1>Manage Courses</h1>
            </Col>
            <hr />
          </Row>

          <Row className="mb-3">
            <Col md={{ span: 4, offset: 8 }} className="text-end">
              <Button variant="outline-success" onClick={() => navigate("new")} aria-label="Add New Course">
                <RiHealthBookLine /> Add Course
              </Button>
            </Col>
          </Row>

          {isLoading ? (
            <Row className="justify-content-center">
              <Col className="text-center">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Loading courses...</span>
              </Col>
            </Row>
          ) : (
            <>
              {showDeleteConfirmation.visible && (
                <DeleteCourse courseData={showDeleteConfirmation.data!} onClose={onDeleteCourseHandler} />
              )}
              {showCopyConfirmation.visible && (
                <CopyCourse courseData={showCopyConfirmation.data!} onClose={onCopyCourseHandler} />
              )}
              <Row>
                <Table
                  showGlobalFilter={false}
                  data={filteredData}
                  columns={tableColumns}
                  columnVisibility={{
                    id: false,
                    institution: auth.user.role === ROLE.SUPER_ADMIN.valueOf(),
                  }}
                />
              </Row>
            </>
          )}
        </Container>
      </main>
    </>
  );
};

export default Courses;
