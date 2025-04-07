import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Rolunk from "../Pages/Rolunk";
import Navbar from "../Components/Navbar";
import SmallHeader from "../Components/SmallHeader";
import Footer from "../Components/Footer";
import { jest } from "@jest/globals";

jest.mock("../Components/Navbar", () => () => <div data-testid="navbar">Navbar</div>);
jest.mock("../Components/SmallHeader", () => () => <div data-testid="small-header">SmallHeader</div>);
jest.mock("../Components/Footer", () => () => <div data-testid="footer">Footer</div>);

describe("Rolunk Component", () => {
    test("Betölti a Navbar, SmallHeader és Footer komponenseket", () => {
        render(<Rolunk />);

        expect(screen.getByTestId("navbar")).toBeInTheDocument();
        expect(screen.getByTestId("small-header")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    test("Betölti a bevezető részt", () => {
        render(<Rolunk />);
        expect(screen.getByText(/A Rentify 2025-ben alakult/i)).toBeInTheDocument();
        expect(screen.getByText(/Célunk, hogy mindenki számára elérhetővé tegyük a kényelmes és biztonságos ingatlanbérlést/i)).toBeInTheDocument();
    });

    test("Betölti az értékeink részt", () => {
        render(<Rolunk />);
        expect(screen.getByText("Felhasználóközpontúság:")).toBeInTheDocument();
        expect(screen.getByText("Átláthatóság:")).toBeInTheDocument();
        expect(screen.getByText("Innováció:")).toBeInTheDocument();
    });

    test("Betölti a csapatunk részt", () => {
        render(<Rolunk />);
        expect(screen.getByText("Csapatunk")).toBeInTheDocument();
        expect(screen.getByText("Jancsurák Napsugár")).toBeInTheDocument();
        expect(screen.getByText("Varga Antónia")).toBeInTheDocument();
        expect(screen.getByText("Katona Alexandra")).toBeInTheDocument();
    });

    test("Betölti az értékelések részt", () => {
        render(<Rolunk />);
        expect(screen.getByText("Értékelések")).toBeInTheDocument();
        expect(screen.getByText("Varga Judit")).toBeInTheDocument();
        expect(screen.getByText("Tóth Balázs")).toBeInTheDocument();
        expect(screen.getByText("Németh Eszter")).toBeInTheDocument();
        expect(screen.getByText("Kovács János")).toBeInTheDocument();
    });
});