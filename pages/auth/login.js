import {
    Alert, AlertIcon,
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react'
import * as React from 'react'
import {useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {format} from "date-fns";
import {userService} from '../../src/userService';
import {useRouter} from "next/router";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const router = useRouter();

    const loginForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().min(3).required("The email is required"),
        }),
        onSubmit: async (values, helpers) => {
            setIsLoading(true);
            setLoginError(false);

            let response = await userService.login(values.email);

            setIsLoading(false);
            if (response) {

            } else {
                setLoginError(true)
                console.log("Error logging the user in");
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
                                Log in to your account
                            </Heading>
                            {loginError && (
                                <>
                                    <Alert status='error'>
                                        <AlertIcon/>
                                        {"Error login in. Please try again"}
                                    </Alert>
                                </>
                            )}
                        </Stack>
                        <Stack spacing="5">
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    isInvalid={Boolean(loginForm.touched.email && loginForm.errors.email)}
                                    id="email"
                                    type="email"
                                    name={"email"}
                                    value={loginForm.values.title}
                                    onChange={loginForm.handleChange}
                                />
                            </FormControl>
                        </Stack>
                        <Stack spacing="6">
                            <Button
                                colorScheme='blue'
                                disabled={isLoading}
                                onClick={() => {
                                    loginForm.handleSubmit();
                                }}
                            >
                                Sign in
                            </Button>
                            <HStack>
                                <Divider/>
                                <Button
                                    variant="link"
                                    colorScheme="blue"
                                    onClick={() => {
                                        router.push("/auth/signup");
                                    }}
                                >
                                    {" Sign up "}
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