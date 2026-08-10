import "@testing-library/jest-dom";

// Mock @dnd-kit/sortable hooks used inside draggable components
jest.mock("@dnd-kit/sortable", () => ({
	useSortable: () => ({
		attributes: {},
		listeners: {},
		setNodeRef: jest.fn(),
		transform: null,
		transition: null,
		isDragging: false,
	}),
}));

jest.mock("@dnd-kit/utilities", () => ({
	CSS: {
		Translate: {
			toString: () => "",
		},
	},
}));
