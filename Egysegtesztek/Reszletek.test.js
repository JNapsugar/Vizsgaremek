import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Reszletek from '../Pages/Reszletek';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('Reszletek komponens', () => {
    const mockProperty = {
        ingatlanId: 1,
        helyszin: 'Teszt Ingatlan',
        cim: 'Teszt cím 123',
        ar: 10000,
        leiras: 'Ez egy teszt ingatlan leírása',
        meret: 50,
        szoba: 2,
        feltoltesDatum: '2023-01-01T00:00:00',
        szolgaltatasok: 'Wi-Fi, parkolás',
        tulajdonosId: 1
    };

    const mockOwner = {
        loginNev: 'tesztfelhasznalo',
        name: 'Teszt Felhasználó',
        email: 'teszt@example.com'
    };

    const mockPropertyImage = {
        kepUrl: 'http://example.com/image.jpg'
    };

    beforeEach(() => {
        Storage.prototype.getItem = jest.fn((key) => {
        if (key === 'permission') return '3';
        if (key === 'userId') return '1';
        return null;
    });


    axios.get.mockImplementation((url) => {
        if (url.includes('api/Ingatlan/ingatlanok/1')) {
            return Promise.resolve({ data: mockProperty });
        }
        if (url.includes('api/Felhasznalo/felhasznalo/1')) {
            return Promise.resolve({ data: mockOwner });
        }
        if (url.includes('api/Ingatlankepek/ingatlankepek/1')) {
            return Promise.resolve({ data: mockPropertyImage });
        }
        if (url.includes('api/Foglalasok/ingatlan/1')) {
            return Promise.resolve({ data: { bookings: [] } });
        }
        if (url.includes('api/Ingatlan/ingatlanok')) {
            return Promise.resolve({ data: [] });
        }
        if (url.includes('api/Ingatlankepek/ingatlankepek')) {
            return Promise.resolve({ data: [] });
        }
            return Promise.reject(new Error('Nem mockolt URL'));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Alapvető renderelés és adatok megjelenítése', async () => {
        render(
        <MemoryRouter initialEntries={['/ingatlan/1']}>
            <Routes>
                <Route path="/ingatlan/:ingatlanId" element={<Reszletek />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Teszt Ingatlan')).toBeInTheDocument();
        expect(screen.getByText('Teszt cím 123')).toBeInTheDocument();
        expect(screen.getByText('10000 Ft/éjszaka')).toBeInTheDocument();
        expect(screen.getByText('Ez egy teszt ingatlan leírása')).toBeInTheDocument();
    });
    });

    test('Foglalási űrlap megjelenik bérlőként', async () => {
        render(
        <MemoryRouter initialEntries={['/ingatlan/1']}>
            <Routes>
                <Route path="/ingatlan/:ingatlanId" element={<Reszletek />} />
            </Routes>
        </MemoryRouter>
        );

    await waitFor(() => {
        expect(screen.getByText(/válasszon kezdődátumot/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /foglalás/i })).toBeInTheDocument();
    });
});

    test('Nem jelenik meg foglalási űrlap vendégként', async () => {
        Storage.prototype.getItem = jest.fn(() => null);

    render(
        <MemoryRouter initialEntries={['/ingatlan/1']}>
            <Routes>
                <Route path="/ingatlan/:ingatlanId" element={<Reszletek />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText(/foglaláshoz jelentkezzen be egy bérlő fiókba/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /foglalás/i })).not.toBeInTheDocument();
        });
    });
});