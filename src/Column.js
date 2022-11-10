import {Badge, Box, Button, Flex, HStack, Spacer, Text} from "@chakra-ui/react";
import {isEmpty} from "lodash";
import React from "react";
import {Draggable} from "react-beautiful-dnd";
import {Droppable} from "react-beautiful-dnd";
import {todoService} from "./todoService";

const Column = ({todoList, onRefresh, placeholderProps}) => {

    const markTodoAsCompleted = async (todoId) => {
        let response = await todoService.markTodoAsCompleted(todoId);

        if (response) {
            onRefresh();
        } else {

        }
    }
    return (
        <Flex
            rounded="3px"
            bg="column-bg"
            w="90vw"
            flexDir="column"
            position="relative"
        >
            <Droppable droppableId="todo-list">
                {(droppableProvided) => (
                    <Flex
                        p="1.5rem"
                        flex={1}
                        flexDir="column"
                        {...droppableProvided.droppableProps}
                        ref={droppableProvided.innerRef}
                    >
                        {todoList.map((todoItem) => {
                            return (
                                <Draggable
                                    key={todoItem.id}
                                    draggableId={todoItem.id}
                                    index={todoItem.order}
                                >
                                    {(draggableProvided, draggableSnapshot) => (
                                        <Flex
                                            mb="1rem"
                                            bg="card-bg"
                                            rounded="3px"
                                            p="1.5rem"
                                            _active={{bg: "#23252F"}}
                                            outline="2px solid"
                                            // outlineColor={
                                            //     draggableSnapshot.isDragging
                                            //         ? "card-border"
                                            //         : "transparent"
                                            // }
                                            outlineColor="card-border"
                                            boxShadow={
                                                draggableSnapshot.isDragging
                                                    ? "0 5px 10px rgba(0, 0, 0, 0.6)"
                                                    : "unset"
                                            }
                                            align="center"
                                            zIndex={1}
                                            {...draggableProvided.dragHandleProps}
                                            {...draggableProvided.draggableProps}
                                            ref={draggableProvided.innerRef}
                                        >
                                            <Flex flexDir="column" align="left">
                                                <HStack>
                                                    <Text fontSize="20px">{todoItem.title}</Text>
                                                    {todoItem.state === "pending" && (
                                                        <Badge borderRadius='full' px='2' color='#ED8936'>
                                                            {todoItem.state}
                                                        </Badge>
                                                    )}
                                                    {todoItem.state === "completed" && (
                                                        <Badge borderRadius='full' px='2' colorScheme='green'>
                                                            {todoItem.state}
                                                        </Badge>
                                                    )}
                                                </HStack>
                                                <Text fontSize="20px">{todoItem.description}</Text>
                                                <Text fontSize="20px">Due Date: {todoItem.dueDate}</Text>
                                                <Flex mt={4} minWidth='max-content' alignItems='center' gap='2'>
                                                    {!todoItem.completedAt && (
                                                        <Button
                                                            colorScheme='gray'
                                                            size='sm'
                                                            onClick={() => {
                                                                markTodoAsCompleted(todoItem.id)
                                                            }}
                                                        >
                                                            Mark as completed
                                                        </Button>
                                                    )}
                                                </Flex>

                                            </Flex>
                                        </Flex>
                                    )}
                                </Draggable>
                            );
                        })}
                        {droppableProvided.placeholder}
                        {!isEmpty(placeholderProps) && (
                            <Flex
                                position="absolute"
                                top={`${placeholderProps.clientY}px`}
                                rounded="3px"
                                opacity={0.6}
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor="card-border"
                                height={`${placeholderProps.clientHeight}px`}
                                width={`${placeholderProps.clientWidth}px`}
                            />
                        )}
                    </Flex>
                )}
            </Droppable>
        </Flex>
    );
};

export default Column;
