import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react'
import * as React from 'react'
import {useRouter} from "next/router";
import {useFormik} from "formik";
import * as Yup from "yup";
import {userService} from "../../src/userService";
import {useState} from "react";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [signupError, setSignupError] = useState(false);

    const signupForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            email: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().min(3).required("The email is required"),
            email: Yup.string().min(3).required("The email is required"),
        }),
        onSubmit: async (values, helpers) => {
            setIsLoading(true);
            setSignupError(false);

            let response = await userService.createAccount(values.name, values.email);

            setIsLoading(false);
            if (response) {

            } else {
                setSignupError(true)
                console.log("Error signup user");
            }
        }
    });

    return (
        <Container maxW="lg" py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
            <Stack spacing="8">
                <Box
                    py={{base: '0', sm: '8'}}
                    px={{base: '4', sm: '10'}}
                    bg={useBreakpointValue({base: 'transparent', sm: 'bg-surface'})}
                    boxShadow={{base: 'none', sm: useColorModeValue('md', 'md-dark')}}
                    borderRadius={{base: 'none', sm: 'xl'}}
                >
                    <Stack spacing="6">
                        <Stack spacing={{base: '2', md: '3'}} textAlign="center">
                            <Heading size={useBreakpointValue({base: 'xs', md: 'sm'})}>
                                Create an account
                            </Heading>
                        </Stack>
                        <Stack spacing="5">
                            <FormControl>
                                <FormLabel htmlFor="name">Full name</FormLabel>
                                <Input
                                    id="name"
                                    isInvalid={Boolean(signupForm.touched.name && signupForm.errors.name)}
                                    name={"name"}
                                    value={signupForm.values.name}
                                    onChange={signupForm.handleChange}
                                />
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    isInvalid={Boolean(signupForm.touched.email && signupForm.errors.email)}
                                    id="email"
                                    type="email"
                                    name={"email"}
                                    value={signupForm.values.email}
                                    onChange={signupForm.handleChange}
                                />
                            </FormControl>
                        </Stack>
                        <Stack spacing="6">
                            <Button
                                colorScheme='blue'
                                onClick={() => {
                                    signupForm.handleSubmit();
                                }}
                            >
                                Create account
                            </Button>
                            <HStack>
                                <Divider/>
                                <Button
                                    variant="link"
                                    colorScheme="blue"
                                    onClick={() => {
                                        router.push("/auth/login");
                                    }}
                                >
                                    {" Login "}
                                </Button>
                                <Divider/>
                            </HStack>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}