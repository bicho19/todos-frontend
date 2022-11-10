import {
    Alert, AlertIcon,
    Button,
    Flex, FormControl, FormLabel,
    Heading, HStack, Input, InputGroup, InputRightElement,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    Skeleton, Spacer, Spinner,
    Stack,
    Text, Textarea,
    useDisclosure, VStack
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {DragDropContext} from "react-beautiful-dnd";
import {SingleDatepicker} from "chakra-dayzed-datepicker";
import {useFormik} from "formik";
import * as Yup from "yup";
import {add, format} from 'date-fns';
import {userService} from "../src/userService";
import {todoService} from "../src/todoService";
import {useRouter} from "next/router";

const Column = dynamic(() => import("../src/Column"), {ssr: false});

const reorderTasks = (tasks, startIndex, endIndex) => {
    const newTaskList = Array.from(tasks);
    const [removed] = newTaskList.splice(startIndex, 1);
    newTaskList.splice(endIndex, 0, removed);
    return newTaskList;
};

export default function Home() {
    const [todoDataList, setTodoDataList] = useState(null)
    const [isLoading, setLoading] = useState(true);
    const [isInitializing, setIsInitializing] = useState(true);

    const [createTodoLoading, setCreateTodoLoading] = useState(false);
    const [createTodoErrorMessage, setCreateTodoErrorMessage] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const router = useRouter();

    const createTodoForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: "",
            description: "",
            dueDate: undefined,
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().min(3).required("The title is required"),
            description: Yup.string(),
            dueDate: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            setCreateTodoLoading(true);
            setCreateTodoErrorMessage(null);

            fetch("https://factory-digital-test.herokuapp.com/api/v1/todos/create", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODg4ZDhkLWE3ZTUtNDI5Mi05ZjI2LWM5ZWRiNzE1YTYxYSIsImlhdCI6MTY2Nzk4NjM0MywiZXhwIjoxNjgzNzU0MzQzfQ.WjJQhsnnNf_DbDB27AQtG0cN8x68VM798tW286_zPaU"
                },
                body: JSON.stringify({
                    "title": values.title,
                    "description": values.description.length > 0 ? values.description : null,
                    "dueBy": values.dueDate ? format(values.dueDate, "yyyy-MM-dd") : null,
                })
            }).then((res) => res.json())
                .then((results) => {
                    if (results.status) {
                        setCreateTodoLoading(false);
                        onClose();
                        fetchTodos();
                        createTodoForm.resetForm();
                    } else {
                        console.log("Error creating the todo ");
                        setCreateTodoErrorMessage(`Error: ${results.message}`);
                        setCreateTodoLoading(false);
                    }
                })
        }
    })

    useEffect(() => {
        // Check if the user exits
        if (userService.isUserLoggedIn()){
            setIsInitializing(false);
            fetchTodos();
        } else {
            setIsInitializing(false);
            router.push("/auth/login");
        }
    }, []);

    const fetchTodos = async () => {
        setLoading(true)
        let data = await todoService.fetchTodos();

        if (data){
            setTodoDataList(data);
            setLoading(false);
        }
    }

    const logoutUser = () => {
        userService.logout();
        router.push("/auth/login");
    }

    const queryAttr = "data-rbd-drag-handle-draggable-id";


    const [state, setState] = useState(initialData);


    const [placeholderProps, setPlaceholderProps] = useState({});

    const getDraggedDom = (draggableId) => {
        const domQuery = `[${queryAttr}='${draggableId}']`;
        const draggedDOM = document.querySelector(domQuery);

        return draggedDOM;
    };

    const onDragEnd = (result) => {
        console.log("OnDrag Ended ", result);
        const {source, destination} = result;

        // if the user drops outside of a droppable destination
        if (!destination) return;

        // If the user drags and drops back in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // If the user drops in a different postion
        const {tasks} = state;
        const newTasks = reorderTasks(tasks, source.index, destination.index);

        const newState = {
            ...state,
            tasks: newTasks,
        };
        setState(newState);
    };

    const onDragUpdate = (result) => {
        const {source, destination, draggableId} = result;

        if (!destination) return;

        const draggedDOM = getDraggedDom(draggableId);

        if (!draggedDOM.parentNode) return;

        const {clientHeight, clientWidth} = draggedDOM;
        const destinationIndex = destination.index;
        const sourceIndex = source.index;

        const childrenArray = draggedDOM.parentNode.children
            ? [...draggedDOM.parentNode.children]
            : [];

        const movedItem = childrenArray[sourceIndex];
        childrenArray.splice(sourceIndex, 1);

        const updatedArray = [
            ...childrenArray.splice(0, destinationIndex),
            movedItem,
            ...childrenArray.splice(destinationIndex + 1),
        ];

        const clientY =
            parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
            updatedArray.splice(0, destinationIndex).reduce((total, current) => {
                const style = current.currentStyle || window.getComputedStyle(current);
                const marginBottom = parseFloat(style.marginBottom);
                return total + current.clientHeight + marginBottom;
            }, 0);

        setPlaceholderProps({
            clientHeight,
            clientWidth,
            clientY,
        });
    };

    const onDragStart = (result) => {
        console.log("Drag started width data ", result);
        const {source, draggableId} = result;
        const draggedDOM = getDraggedDom(draggableId);

        if (!draggedDOM) return;

        const {clientHeight, clientWidth} = draggedDOM;
        const sourceIndex = source.index;

        if (!draggedDOM.parentNode) return;

        /**
         * 1. Take all the items in the list as an array
         * 2. Slice from the start to the where we are dropping the dragged item (i.e destinationIndex)
         * 3. Reduce and fetch the styles of each item
         * 4. Add up the margins, widths, paddings
         * 5. Accumulate and assign that to clientY
         */
        const clientY =
            parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
            [...draggedDOM.parentNode.children]
                .slice(0, sourceIndex)
                .reduce((total, current) => {
                    const style =
                        current.currentStyle || window.getComputedStyle(current);
                    const marginBottom = parseFloat(style.marginBottom);

                    return total + current.clientHeight + marginBottom;
                }, 0);

        setPlaceholderProps({
            clientHeight,
            clientWidth,
            clientY,
        });
    };

    if (isInitializing){
        return (
            <>
                <Flex align={"center"}>
                    <Spinner color='red.500'/>
                </Flex>
            </>
        )
    } else {
        return (
            <>
                <DragDropContext
                    onDragStart={onDragStart}
                    onDragUpdate={onDragUpdate}
                    onDragEnd={onDragEnd}
                >
                    <Flex
                        flexDir="column"
                        minH="100vh"
                        w="full"
                        pb="2rem"
                    >
                        <Flex py="4rem" flexDir="column" align="center">
                            <Heading fontSize="3xl" fontWeight={600}>
                                Factory Digital Test
                            </Heading>
                            <Text fontSize="20px" fontWeight={600} color="subtle-text">This frontend used to manage
                                todos, build using NextJS, Chakra-UI and the fetch apis from Javascript</Text>
                        </Flex>

                        <VStack spacing='16px' align="center">
                            <HStack>
                                <Button colorScheme='blue' onClick={onOpen}>Add new</Button>
                                <Button colorScheme='red' onClick={logoutUser}>Logout</Button>
                            </HStack>
                            <Spacer />
                            {isLoading && (
                                <>
                                    <Flex>
                                        <Spinner color='red.500'/>
                                    </Flex>
                                </>
                            )}
                            {!isLoading && (
                                <Column placeholderProps={placeholderProps} todoList={todoDataList}/>
                            )}
                        </VStack>
                    </Flex>
                </DragDropContext>

                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalContent>
                        <ModalHeader>Create todo</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody pb={6}>
                            {createTodoErrorMessage && (
                                <Alert status='error'>
                                    <AlertIcon/>
                                    {createTodoErrorMessage}
                                </Alert>
                            )}
                            <FormControl mt={3}>
                                <FormLabel>Title</FormLabel>
                                <Input
                                    name={"title"}
                                    placeholder='Build front end'
                                    value={createTodoForm.values.title}
                                    onChange={createTodoForm.handleChange}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    name={"description"}
                                    placeholder="Frontend is not my type, but let's try"
                                    value={createTodoForm.values.description}
                                    onChange={createTodoForm.handleChange}
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Description</FormLabel>
                                <InputGroup size='md'>
                                    <SingleDatepicker
                                        name="date-input"
                                        date={createTodoForm.values.dueDate}
                                        onDateChange={(value) => createTodoForm.setFieldValue("dueDate", add(value, {hours: 1}))}
                                        minDate={new Date()}
                                        configs={{
                                            dateFormat: 'yyyy-MM-dd',
                                        }}
                                    />
                                    <InputRightElement width='4.5rem'>
                                        <Button
                                            h='1.75rem'
                                            size='sm'
                                            disabled={!createTodoForm.values.dueDate}
                                            onClick={() => {
                                                createTodoForm.setFieldValue("dueDate", undefined);
                                            }}
                                        >
                                            {'Clear'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme='blue'
                                mr={3}
                                onClick={() => {
                                    createTodoForm.handleSubmit();
                                }}
                                disabled={createTodoLoading}
                            >
                                Create
                            </Button>
                            <Button
                                onClick={onClose}
                                disabled={createTodoLoading}
                            >Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    }
}

const initialData = {
    tasks: [
        {id: 1, content: "The first task"},
        {id: 2, content: "The second task"},
        {id: 3, content: "The third task"},
        {id: 4, content: "The fourth task"},
        {id: 5, content: "The fifth task"},
    ],
};
