import FormCheckBoxGroup from "components/Form/FormCheckBoxGroup";
import FormInput from "components/Form/FormInput";
import FormSelect from "components/Form/FormSelect";
import { Form, Formik, FormikHelpers } from "formik";
import useAPI from "hooks/useAPI";
import React, { useEffect, useState } from "react";
import { Button, InputGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { alertActions } from "store/slices/alertSlice"; // Success message utility
import { HttpMethod } from "utils/httpMethods";
import * as Yup from "yup";
import { RootState } from "../../store/store";
import { IEditor, ROLE } from "../../utils/interfaces";
import { ICourseFormValues, courseVisibility, noSpacesSpecialCharsQuotes, transformCourseRequest } from "./CourseUtil";

/**
 * @author Suraj
 * @editor Added Success Message on Course Creation
 */

// Initial form values
const initialValues: ICourseFormValues = {
  name: "",
  directory: "",
  private: [],
  institution_id: 0,
  instructor_id: -1,
  info: "",
};

// Validation schema for the course form
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Required")
    .min(3, "Course name must be at least 3 characters")
    .max(20, "Course name must be at most 20 characters"),
  info: Yup.string().required("Required").nonNullable(),
  directory: Yup.string()
    .required("Required")
    .nonNullable()
    .test("no-spaces-special-chars-quotes", "Invalid characters", noSpacesSpecialCharsQuotes),
  institution_id: Yup.string().required("Required").nonNullable(),
});

const CourseEditor: React.FC<IEditor> = ({ mode }) => {
  const { data: courseResponse, error: courseError, sendRequest } = useAPI();
  const { data: users, sendRequest: fetchusers } = useAPI();
  const auth = useSelector(
    (state: RootState) => state.authentication,
    (prev, next) => prev.isAuthenticated === next.isAuthenticated
  );
  const { courseData, institutions }: any = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  interface IFormOption {
    label: string;
    value: string;
  }

  const [filteredInstructors, setFilteredInstructors] = useState<IFormOption[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);

  // Fetch all users or restrict based on the logged-in role
  useEffect(() => {
    if (auth.user.role === ROLE.INSTRUCTOR.valueOf()) {
      setSelectedInstitutionId(auth.user.institution_id);
      setFilteredInstructors([
        { label: auth.user.full_name, value: String(auth.user.id) },
      ]);
    } else {
      fetchusers({ url: "/users" });
    }
  }, [auth.user, fetchusers]);

  // Filter instructors based on selected institution
  useEffect(() => {
    if (users) {
      const instructorsList: IFormOption[] = [{ label: "Select an Instructor", value: "" }];
      const onlyInstructors = users.data.filter(
        (user: any) =>
          user.role.name === "Instructor" &&
          user.institution.id === selectedInstitutionId
      );
      onlyInstructors.forEach((instructor: any) => {
        instructorsList.push({
          label: instructor.name,
          value: String(instructor.id),
        });
      });
      setFilteredInstructors(instructorsList);
    }
  }, [users, selectedInstitutionId]);

  const handleInstitutionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const institutionId = Number(event.target.value);
    setSelectedInstitutionId(institutionId);
  };

  // Show success message after course creation
  useEffect(() => {
    if (courseResponse && courseResponse.status >= 200 && courseResponse.status < 300) {
      dispatch(
        alertActions.showAlert({
          variant: "success",
          message: `Course "${courseResponse.data.name}" created successfully!`, // Display course name
        })
      );
      navigate(location.state?.from || "/courses"); // Redirect back to courses
    }
  }, [courseResponse, dispatch, navigate, location.state]);

  const onSubmit = (
    values: ICourseFormValues,
    submitProps: FormikHelpers<ICourseFormValues>
  ) => {
    const method = mode === "update" ? HttpMethod.PATCH : HttpMethod.POST;
    const url = mode === "update" ? `/courses/${values.id}` : "/courses";

    sendRequest({
      url,
      method,
      data: values,
      transformRequest: transformCourseRequest,
    });

    submitProps.setSubmitting(false);
  };

  return (
    <Modal size="lg" centered show={true} onHide={() => navigate(location.state?.from || "/courses")} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{mode === "update" ? "Update Course" : "Create Course"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {courseError && <p className="text-danger">{courseError}</p>}
        <Formik<ICourseFormValues>
          initialValues={{
            ...initialValues,
            institution_id: auth.user.role === ROLE.INSTRUCTOR.valueOf() ? auth.user.institution_id : initialValues.institution_id,
            instructor_id: auth.user.role === ROLE.INSTRUCTOR.valueOf() ? auth.user.id : initialValues.instructor_id,
          }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
          enableReinitialize={true}
        >
          {(formik) => (
            <Form>
              {/* Institution Dropdown */}
              {auth.user.role === ROLE.INSTRUCTOR.valueOf() && (
                <FormSelect
                  controlId="course-institution"
                  name="institution_id"
                  disabled={true}
                  options={[
                    {
                      label:
                        institutions.find(
                          (inst: any) => inst.value === auth.user.institution_id
                        )?.label || "Select Institution",
                      value: String(auth.user.institution_id),
                    },
                  ]}
                  inputGroupPrepend={
                    <InputGroup.Text id="course-inst-prep">Institution</InputGroup.Text>
                  }
                />
              )}
              {auth.user.role !== ROLE.INSTRUCTOR.valueOf() && (
                <FormSelect
                  controlId="course-institution"
                  name="institution_id"
                  disabled={mode === "update"}
                  options={institutions}
                  inputGroupPrepend={
                    <InputGroup.Text id="course-inst-prep">Institution</InputGroup.Text>
                  }
                  onChange={handleInstitutionChange}
                />
              )}

              {/* Instructor Dropdown */}
              {auth.user.role === ROLE.INSTRUCTOR.valueOf() && (
                <FormSelect
                  controlId="course-instructor"
                  name="instructor_id"
                  disabled={true}
                  options={[
                    {
                      label: auth.user.full_name,
                      value: String(auth.user.id),
                    },
                  ]}
                  inputGroupPrepend={
                    <InputGroup.Text id="course-inst-prep">Instructor</InputGroup.Text>
                  }
                />
              )}
              {auth.user.role !== ROLE.INSTRUCTOR.valueOf() && (
                <FormSelect
                  controlId="course-instructor"
                  name="instructor_id"
                  disabled={mode === "update"}
                  options={filteredInstructors}
                  inputGroupPrepend={
                    <InputGroup.Text id="course-inst-prep">Instructors</InputGroup.Text>
                  }
                />
              )}

              <FormInput
                controlId="name"
                label="Name"
                name="name"
                disabled={mode === "update"}
              />
              <FormInput
                controlId="directory"
                label="Course Directory (Mandatory field. No Spaces, Special Characters, or quotes)"
                name="directory"
              />
              <FormInput controlId="info" label="Course Information" name="info" />
              <FormCheckBoxGroup
                controlId="course-visibility"
                label="Course Visibility"
                name="private"
                options={courseVisibility}
              />

              <Modal.Footer>
                <Button variant="outline-secondary" onClick={() => navigate(location.state?.from || "/courses")}>
                  Close
                </Button>
                <Button
                  variant="outline-success"
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                >
                  {mode === "update" ? "Update Course" : "Create Course"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CourseEditor;
