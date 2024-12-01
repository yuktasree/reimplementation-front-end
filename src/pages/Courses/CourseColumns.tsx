import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button, Tooltip, OverlayTrigger, Badge } from "react-bootstrap";
import { ICourseResponse as ICourse } from "../../utils/interfaces";

/**
 * Author: Suraj Raghu Kumar on October 27, 2023
 */

type Fn = (row: Row<ICourse>) => void;

const columnHelper = createColumnHelper<ICourse>();

export const courseColumns = (
  handleEdit: Fn,
  handleDelete: Fn,
  handleTA: Fn,
  handleCopy: Fn,
  handleShowDetails: (course: ICourse) => void
) => [
  columnHelper.accessor("name", {
    id: "name",
    header: () => <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '1.17em' }}>Course Name</span>,
    cell: (info) => (
      <div className="d-flex justify-content-start align-items-center" style={{ fontSize: '1.1em', padding: '8px 0' }}>
        <span style={{ color: '#000000' }}>{info.getValue()}</span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: false,
  }),
  

  columnHelper.accessor("institution.name", {
    id: "institution",
    header: () => <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '1.17em' }}>Institution</span>,
    enableSorting: true,
    enableMultiSort: true,
    enableGlobalFilter: false,
    cell: (info) => (
      <div className="d-flex justify-content-start align-items-center" style={{ fontSize: '1.17em', padding: '8px 0' }}>
        <span>{info.getValue() || <Badge bg="secondary">Not Available</Badge>}</span>
      </div>
    ),
  }),

  columnHelper.accessor("instructor.name", {
    id: "instructor",
    header: () => <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '1.17em' }}>Instructor</span>,
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const instructor = row.original.instructor;
      return (
        <div className="d-flex justify-content-start align-items-center" style={{ fontSize: '1.17em', 
        padding: '8px 0' }}>
          <span>
            {instructor && instructor.name ? (
              instructor.name
            ) : (
              <Badge bg="danger">Unassigned</Badge>
            )}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("created_at", {
    header: () => <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '1.17em' }}>Creation Date</span>,
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: true,
    cell: (info) => (
      <div className="d-flex justify-content-start align-items-center" style={{ fontSize: '1.17em', padding: '8px 0' }}>
        <span>{new Date(info.getValue()).toLocaleDateString() || <Badge bg="secondary">N/A</Badge>}</span>
      </div>
    ),
  }),

  columnHelper.accessor("updated_at", {
    header: () => <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '1.17em' }}>Updated Date</span>,
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: true,
    cell: (info) => (
      <div className="d-flex justify-content-start align-items-center" style={{ fontSize: '1.17em', padding: '8px 0' }}>
        <span>{new Date(info.getValue()).toLocaleDateString() || <Badge bg="secondary">N/A</Badge>}</span>
      </div>
    ),
  }),

  columnHelper.display({
    id: "actions",
    header: () => <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '1.17em' }}>Actions</span>,
    cell: ({ row }) => (
      <div className="d-flex justify-content-around" style={{ fontSize: '1.17em', padding: '8px 0' }}>
        <OverlayTrigger overlay={<Tooltip>Edit Course</Tooltip>}>
          <Button
            variant="link"
            onClick={() => handleEdit(row)}
            aria-label="Edit Course"
            style={{ padding: '0', margin: '0 8px' }} // Add margin for spacing
          >
            <img src={process.env.PUBLIC_URL + '/assets/images/edit-icon-24.png'} alt="Edit" style={{ width: '25px', height: '20px' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip>Delete Course</Tooltip>}>
          <Button
            variant="link"
            onClick={() => handleDelete(row)}
            aria-label="Delete Course"
            style={{ padding: '0', margin: '0 8px' }}
          >
            <img src={process.env.PUBLIC_URL + '/assets/images/delete-icon-24.png'} alt="Delete" style={{ width: '25px', height: '20px' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip>Assign TA</Tooltip>}>
          <Button
            variant="link"
            onClick={() => handleTA(row)}
            aria-label="Assign TA"
            style={{ padding: '0', margin: '0 8px' }}
          >
            <img src={process.env.PUBLIC_URL + '/assets/images/add-ta-24.png'} alt="Assign TA" style={{ width: '35px', height: '25px' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip>Copy Course</Tooltip>}>
          <Button
            variant="link"
            onClick={() => handleCopy(row)}
            aria-label="Copy Course"
            style={{ padding: '0', margin: '0 8px' }}
          >
            <img src={process.env.PUBLIC_URL + '/assets/images/Copy-icon-24.png'} alt="Copy" style={{ width: '35px', height: '25px' }} />
          </Button>
        </OverlayTrigger>
      </div>
    ),
  }),
];
