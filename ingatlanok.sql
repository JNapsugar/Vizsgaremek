-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 09. 08:38
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `ingatlanok`
--
CREATE DATABASE IF NOT EXISTS `ingatlanok` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `ingatlanok`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `felhasznalo_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefon` varchar(15) DEFAULT NULL,
  `felhasznalo_tipus` enum('tulajdonos','berlo') NOT NULL,
  `letrehozas_datum` timestamp NOT NULL DEFAULT current_timestamp(),
  `szerepkor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`felhasznalo_id`, `nev`, `email`, `jelszo`, `telefon`, `felhasznalo_tipus`, `letrehozas_datum`, `szerepkor_id`) VALUES
(1, 'Admin Felhasználó', 'admin@example.com', 'admin123', '06201234567', 'tulajdonos', '2024-12-09 07:13:55', 1),
(2, 'Tulajdonos Péter', 'tulaj@example.com', 'tulaj123', '06209876543', 'tulajdonos', '2024-12-09 07:13:55', 2),
(3, 'Bérlő Anna', 'berlo@example.com', 'berlo123', '06202345678', 'berlo', '2024-12-09 07:13:55', 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `foglalas_id` int(11) NOT NULL,
  `ingatlan_id` int(11) NOT NULL,
  `berlo_id` int(11) NOT NULL,
  `kezdes_datum` date NOT NULL,
  `befejezes_datum` date NOT NULL,
  `allapot` enum('függőben','elfogadva','elutasítva') DEFAULT 'függőben',
  `letrehozas_datum` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `foglalasok`
--

INSERT INTO `foglalasok` (`foglalas_id`, `ingatlan_id`, `berlo_id`, `kezdes_datum`, `befejezes_datum`, `allapot`, `letrehozas_datum`) VALUES
(1, 1, 3, '2024-12-15', '2024-12-20', 'függőben', '2024-12-09 07:16:09'),
(2, 2, 3, '2024-12-25', '2024-12-30', 'elfogadva', '2024-12-09 07:16:09');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ingatlankepek`
--

CREATE TABLE `ingatlankepek` (
  `kep_id` int(11) NOT NULL,
  `ingatlan_id` int(11) NOT NULL,
  `kep_url` varchar(255) NOT NULL,
  `feltoltes_datum` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ingatlanok`
--

CREATE TABLE `ingatlanok` (
  `ingatlan_id` int(11) NOT NULL,
  `tulajdonos_id` int(11) NOT NULL,
  `cim` varchar(255) NOT NULL,
  `leiras` text DEFAULT NULL,
  `helyszin` varchar(255) DEFAULT NULL,
  `ar` decimal(10,2) NOT NULL,
  `meret` int(11) DEFAULT NULL,
  `szolgaltatasok` text DEFAULT NULL,
  `feltoltes_datum` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `ingatlanok`
--

INSERT INTO `ingatlanok` (`ingatlan_id`, `tulajdonos_id`, `cim`, `leiras`, `helyszin`, `ar`, `meret`, `szolgaltatasok`, `feltoltes_datum`) VALUES
(1, 2, 'Budapest, Fő utca 1.', 'Tágas 3 szobás lakás a belvárosban', 'Budapest', 250000.00, 80, 'Wi-Fi, parkolás, medence', '2024-12-09 07:15:48'),
(2, 2, 'Debrecen, Tavasz utca 12.', 'Modern ház kerttel', 'Debrecen', 300000.00, 120, 'Wi-Fi, parkolás, kert, kutya hozható', '2024-12-09 07:15:48');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jogosultsagok`
--

CREATE TABLE `jogosultsagok` (
  `jogosultsag_id` int(11) NOT NULL,
  `jogosultsag_nev` varchar(100) NOT NULL,
  `leiras` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `jogosultsagok`
--

INSERT INTO `jogosultsagok` (`jogosultsag_id`, `jogosultsag_nev`, `leiras`) VALUES
(1, 'Ingatlanok kezelése', 'Ingatlan hozzáadása, módosítása és törlése'),
(2, 'Foglalások kezelése', 'Foglalások elfogadása és elutasítása'),
(3, 'Felhasználók kezelése', 'Új felhasználók hozzáadása és adminisztrálása');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szerepkorjogosultsagok`
--

CREATE TABLE `szerepkorjogosultsagok` (
  `szerepkor_id` int(11) NOT NULL,
  `jogosultsag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szerepkorjogosultsagok`
--

INSERT INTO `szerepkorjogosultsagok` (`szerepkor_id`, `jogosultsag_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szerepkorok`
--

CREATE TABLE `szerepkorok` (
  `szerepkor_id` int(11) NOT NULL,
  `szerepkor_nev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szerepkorok`
--

INSERT INTO `szerepkorok` (`szerepkor_id`, `szerepkor_nev`) VALUES
(1, 'Adminisztrátor'),
(3, 'Bérlő'),
(2, 'Tulajdonos');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`felhasznalo_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `szerepkor_id` (`szerepkor_id`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`foglalas_id`),
  ADD KEY `ingatlan_id` (`ingatlan_id`),
  ADD KEY `berlo_id` (`berlo_id`);

--
-- A tábla indexei `ingatlankepek`
--
ALTER TABLE `ingatlankepek`
  ADD PRIMARY KEY (`kep_id`),
  ADD KEY `ingatlan_id` (`ingatlan_id`);

--
-- A tábla indexei `ingatlanok`
--
ALTER TABLE `ingatlanok`
  ADD PRIMARY KEY (`ingatlan_id`),
  ADD KEY `tulajdonos_id` (`tulajdonos_id`);

--
-- A tábla indexei `jogosultsagok`
--
ALTER TABLE `jogosultsagok`
  ADD PRIMARY KEY (`jogosultsag_id`),
  ADD UNIQUE KEY `jogosultsag_nev` (`jogosultsag_nev`);

--
-- A tábla indexei `szerepkorjogosultsagok`
--
ALTER TABLE `szerepkorjogosultsagok`
  ADD PRIMARY KEY (`szerepkor_id`,`jogosultsag_id`),
  ADD KEY `jogosultsag_id` (`jogosultsag_id`);

--
-- A tábla indexei `szerepkorok`
--
ALTER TABLE `szerepkorok`
  ADD PRIMARY KEY (`szerepkor_id`),
  ADD UNIQUE KEY `szerepkor_nev` (`szerepkor_nev`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `ingatlankepek`
--
ALTER TABLE `ingatlankepek`
  MODIFY `kep_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `ingatlanok`
--
ALTER TABLE `ingatlanok`
  MODIFY `ingatlan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `jogosultsagok`
--
ALTER TABLE `jogosultsagok`
  MODIFY `jogosultsag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `szerepkorok`
--
ALTER TABLE `szerepkorok`
  MODIFY `szerepkor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD CONSTRAINT `felhasznalok_ibfk_1` FOREIGN KEY (`szerepkor_id`) REFERENCES `szerepkorok` (`szerepkor_id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`ingatlan_id`) REFERENCES `ingatlanok` (`ingatlan_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`berlo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `ingatlankepek`
--
ALTER TABLE `ingatlankepek`
  ADD CONSTRAINT `ingatlankepek_ibfk_1` FOREIGN KEY (`ingatlan_id`) REFERENCES `ingatlanok` (`ingatlan_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `ingatlanok`
--
ALTER TABLE `ingatlanok`
  ADD CONSTRAINT `ingatlanok_ibfk_1` FOREIGN KEY (`tulajdonos_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `szerepkorjogosultsagok`
--
ALTER TABLE `szerepkorjogosultsagok`
  ADD CONSTRAINT `szerepkorjogosultsagok_ibfk_1` FOREIGN KEY (`szerepkor_id`) REFERENCES `szerepkorok` (`szerepkor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `szerepkorjogosultsagok_ibfk_2` FOREIGN KEY (`jogosultsag_id`) REFERENCES `jogosultsagok` (`jogosultsag_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
