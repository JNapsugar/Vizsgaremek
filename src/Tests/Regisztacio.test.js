import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Regisztracio from '../Pages/Regisztracio';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

const mockSetItem = jest.fn();
Object.defineProperty(window, 'sessionStorage', {
    value: {
        setItem: mockSetItem,
    },
    writable: true
});

describe('Regisztracio komponens', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Megjelenik a regisztrációs űrlap', () => {
        render(
        <MemoryRouter>
            <Regisztracio />
        </MemoryRouter>
        );

    expect(screen.getByPlaceholderText('Név')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Felhasználónév')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Jelszó')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regisztráció' })).toBeInTheDocument();
});

    test('Input mezők frissítése', () => {
        render(
        <MemoryRouter>
            <Regisztracio />
        </MemoryRouter>
        );

    const nameInput = screen.getByPlaceholderText('Név');
    fireEvent.change(nameInput, { target: { value: 'Teszt Név' } });
    expect(nameInput.value).toBe('Teszt Név');

    const loginInput = screen.getByPlaceholderText('Felhasználónév');
    fireEvent.change(loginInput, { target: { value: 'tesztuser' } });
    expect(loginInput.value).toBe('tesztuser');

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'teszt@example.com' } });
    expect(emailInput.value).toBe('teszt@example.com');

    const passwordInput = screen.getByPlaceholderText('Jelszó');
    fireEvent.change(passwordInput, { target: { value: 'Teszt123' } });
    expect(passwordInput.value).toBe('Teszt123');
});

    test('Sikeres regisztráció', async () => {
        const mockResponse = {
            data: {
                token: 'mock-token',
                username: 'tesztuser'
            },
            status: 200
        };
        axios.post.mockResolvedValue(mockResponse);

    render(
        <MemoryRouter>
            <Regisztracio />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Név'), { target: { value: 'Teszt Név' } });
    fireEvent.change(screen.getByPlaceholderText('Felhasználónév'), { target: { value: 'tesztuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'teszt@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Jelszó'), { target: { value: 'Teszt1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Regisztráció' }));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith("https://localhost:7079/api/Felhasznalo/Register",
        {
            name: "Teszt Név",
            loginName: "tesztuser",
            email: "teszt@example.com",
            password: "Teszt1234",
            permissionId: 3
        }
        );


        expect(mockSetItem).toHaveBeenCalledWith('token', 'mock-token');
        expect(mockSetItem).toHaveBeenCalledWith('username', 'tesztuser');

        expect(mockedNavigate).toHaveBeenCalledWith('/belepes');
    });
});

    test('Sikertelen regisztráció - API hiba', async () => {
        const mockError = {
        response: {
            data: 'A felhasználónév már foglalt',
            status: 400
        }
        };
        axios.post.mockRejectedValue(mockError);

        render(
        <MemoryRouter>
            <Regisztracio />
        </MemoryRouter>
        );

    fireEvent.change(screen.getByPlaceholderText('Név'), { target: { value: 'Teszt Név' } });
    fireEvent.change(screen.getByPlaceholderText('Felhasználónév'), { target: { value: 'tesztuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'teszt@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Jelszó'), { target: { value: 'Teszt1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Regisztráció' }));

    await waitFor(() => {
        expect(screen.getByText('A felhasználónév már foglalt')).toBeInTheDocument();
    });
});

    test('Permission toggle működése', () => {
        render(
        <MemoryRouter>
            <Regisztracio />
        </MemoryRouter>
        );

    const toggle = screen.getByRole('checkbox');
    
    expect(toggle).toBeChecked();
    
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
    
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    });
});