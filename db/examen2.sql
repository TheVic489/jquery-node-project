CREATE DATABASE IF NOT EXISTS `examenuf2` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `examenuf2`;

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `name` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `data` varchar(30) NOT NULL,
  `lang` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `project` VALUES
('Project 1', 'Description 1', 'Frontend', '2022-03-25', 'JQuery'),
('Project 2', 'Description 2', 'Backend', '2022-11-25', 'PHP');


ALTER TABLE `project`
  ADD PRIMARY KEY (`name`);

