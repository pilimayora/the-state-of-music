CREATE TABLE IF NOT EXISTS `state_of_music`.`ticketmaster_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ticketmaster_id` VARCHAR(100) NOT NULL,
  `local_date` DATE NULL,
  `event_genre` VARCHAR(50) NULL,
  `event_subgenre` VARCHAR(50) NULL,
  `venue` VARCHAR(100) NULL,
  `venue_lat` DECIMAL(10,8) NULL,
  `venue_long` DECIMAL(11,8) NULL,
  `artist_id` VARCHAR(50) NULL,
  `artist_name` VARCHAR(100) NULL,
  `artist_genre` VARCHAR(50) NULL,
  `pop` DECIMAL(3,2) NULL,
  `rock` DECIMAL(3,2) NULL,
  `hip_hop` DECIMAL(3,2) NULL,
  `rnb` DECIMAL(3,2) NULL,
  `classical_and_jazz` DECIMAL(3,2) NULL,
  `electronic` DECIMAL(3,2) NULL,
  `country_and_folk` DECIMAL(3,2) NULL,
  `state` VARCHAR(25) NULL,
  `county` VARCHAR(50) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `state_of_music`.`eventbrite_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `eventbrite_id` VARCHAR(100) NOT NULL,
  `local_date` DATE NULL,
  `event_name` VARCHAR(100) NULL,
  `venue_name` VARCHAR(50) NULL,
  `venue_lat` DECIMAL(10,8) NULL,
  `venue_long` DECIMAL(11,8) NULL,
  `genre` VARCHAR(50) NULL,  
  `pop` DECIMAL(3,2) NULL,
  `rock` DECIMAL(3,2) NULL,
  `hip_hop` DECIMAL(3,2) NULL,
  `rnb` DECIMAL(3,2) NULL,
  `classical_and_jazz` DECIMAL(3,2) NULL,
  `electronic` DECIMAL(3,2) NULL,
  `country_and_folk` DECIMAL(3,2) NULL,
  `state` VARCHAR(25) NULL,
  `county` VARCHAR(50) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `state_of_music`.`populations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sum_level` VARCHAR(10) NULL,
  `state_code` INT(3) NULL,
  `state_name` VARCHAR(50) NULL,
  `state_abbr` VARCHAR(2) NULL,
  `county_code` INT(4) NULL,
  `county_name` VARCHAR(100) NULL,
  `pop_2018` INT(10) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `state_of_music`.`all_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `source` VARCHAR(12) NOT NULL,
  `source_id` VARCHAR(50) NOT NULL,
  `venue` VARCHAR(100) NULL,
  `venue_lat` DECIMAL(10,8) NULL,
  `venue_long` DECIMAL(11,8) NULL,
  `state` VARCHAR(25) NULL,
  `county` VARCHAR(50) NULL,
  `pop` DECIMAL(3,2) NULL,
  `rock` DECIMAL(3,2) NULL,
  `hip_hop` DECIMAL(3,2) NULL,
  `rnb` DECIMAL(3,2) NULL,
  `classical_and_jazz` DECIMAL(3,2) NULL,
  `electronic` DECIMAL(3,2) NULL,
  `country_and_folk` DECIMAL(3,2) NULL,
  `dom_genre` VARCHAR(50) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `state_of_music`.`county_level_data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `state_code` INT(3) NULL,
  `state_name` VARCHAR(50) NULL,
  `state_abbr` VARCHAR(2) NULL,
  `county_code` INT(4) NULL,
  `county_name` VARCHAR(100) NULL,
  `pop_2018` INT(10) NULL,
  `pop` DECIMAL(5,2) DEFAULT 0,
  `rock` DECIMAL(5,2) DEFAULT 0,
  `hip_hop` DECIMAL(5,2) DEFAULT 0,
  `rnb` DECIMAL(5,2) DEFAULT 0,
  `classical_and_jazz` DECIMAL(5,2) DEFAULT 0,
  `electronic` DECIMAL(5,2) DEFAULT 0,
  `country_and_folk` DECIMAL(5,2) DEFAULT 0,
  `all_genres` DECIMAL(5,2) DEFAULT 0, 
  `dom_genre` VARCHAR(50) NULL,
  `pop_norm` DECIMAL(5,2) NULL,
  `rock_norm` DECIMAL(5,2) NULL,
  `hip_hop_norm` DECIMAL(5,2) NULL,
  `rnb_norm` DECIMAL(5,2) NULL,
  `classical_and_jazz_norm` DECIMAL(5,2) NULL,
  `electronic_norm` DECIMAL(5,2) NULL,
  `country_and_folk_norm` DECIMAL(5,2) NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE IF NOT EXISTS `state_of_music`.`state_level_data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `state_code` INT(3) NULL,
  `state_name` VARCHAR(50) NULL,
  `state_abbr` VARCHAR(2) NULL,
  `pop_2018` INT(10) NULL,
  `pop` DECIMAL(5,2) DEFAULT 0,
  `rock` DECIMAL(5,2) DEFAULT 0,
  `hip_hop` DECIMAL(5,2) DEFAULT 0,
  `rnb` DECIMAL(5,2) DEFAULT 0,
  `classical_and_jazz` DECIMAL(5,2) DEFAULT 0,
  `electronic` DECIMAL(5,2) DEFAULT 0,
  `country_and_folk` DECIMAL(5,2) DEFAULT 0,
  `all_genres` DECIMAL(5,2) DEFAULT 0, 
  `dom_genre` VARCHAR(50) NULL,
  `pop_norm` DECIMAL(5,2) NULL,
  `rock_norm` DECIMAL(5,2) NULL,
  `hip_hop_norm` DECIMAL(5,2) NULL,
  `rnb_norm` DECIMAL(5,2) NULL,
  `classical_and_jazz_norm` DECIMAL(5,2) NULL,
  `electronic_norm` DECIMAL(5,2) NULL,
  `country_and_folk_norm` DECIMAL(5,2) NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE IF NOT EXISTS `state_of_music`.`venue_level_data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `state_abbr` VARCHAR(2) NULL,
  `county_name` VARCHAR(100) NULL,
  `venue` VARCHAR(100) NULL,
  `venue_lat` DECIMAL(10,8) NULL,
  `venue_long` DECIMAL(11,8) NULL,
  `pop` DECIMAL(5,2) DEFAULT 0,
  `rock` DECIMAL(5,2) DEFAULT 0,
  `hip_hop` DECIMAL(5,2) DEFAULT 0,
  `rnb` DECIMAL(5,2) DEFAULT 0,
  `classical_and_jazz` DECIMAL(5,2) DEFAULT 0,
  `electronic` DECIMAL(5,2) DEFAULT 0,
  `country_and_folk` DECIMAL(5,2) DEFAULT 0,
  `all_genres` DECIMAL(5,2) DEFAULT 0, 
  `dom_genre` VARCHAR(50) NULL,
  PRIMARY KEY (`id`));