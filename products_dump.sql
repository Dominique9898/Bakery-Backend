--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: products; Type: TABLE; Schema: public; Owner: dominikwei
--

CREATE TABLE public.products (
    product_id character varying(15) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    category_id integer,
    status character varying(10) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url character varying(255),
    CONSTRAINT products_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.products OWNER TO dominikwei;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: dominikwei
--

COPY public.products (product_id, name, description, price, stock, category_id, status, created_at, updated_at, image_url) FROM stdin;
P202411438167	黑森林蛋糕	string	13.00	0	1	active	2024-11-20 07:43:32.559082	2024-11-20 07:43:32.559082	http://localhost:30100/uploads/products/1/cake-1732059812559.jpeg
P202411224978	岩烧乳酪包	配料:法国面粉,牛奶,糖,安佳黄油,干酪,淡奶油等	8.00	0	2	active	2024-11-23 10:46:34.155971	2024-11-23 10:46:34.155971	http://localhost:30100/uploads/products/2/----------------1732329994156.jpg
P202411655601	芝士肠仔包	配料:法国面粉,骑乐车达芝士肠,细砂糖,安佳黄油,奶粉,牛奶,芝士粉等	9.00	0	2	active	2024-11-23 10:50:19.922394	2024-11-23 10:50:19.922394	http://localhost:30100/uploads/products/2/----------------1732330219922.jpg
P202411691474	醇·牛乳吐司-小方盒	配料:法国面粉,牛奶糖,安佳黄油,淡奶油等	14.00	0	2	active	2024-11-23 10:53:05.450967	2024-11-23 10:53:05.450967	http://localhost:30100/uploads/products/2/----------------------------1732330385451.jpg
P202411233104	巧克力全麦软欧包	配料:法国面粉,黑全麦粉,细砂糖,安佳黄油,比利时巧克力豆,蜂蜜等	13.00	0	2	active	2024-11-23 10:54:20.899126	2024-11-23 10:54:20.899126	http://localhost:30100/uploads/products/2/-------------------------1732330460899.jpg
P202411163261	开心果夹心奶油蛋糕便当盒	配料:面粉,鸡蛋,糖,玉米油,淡奶油,开心果酱,新鲜无花果,蓝莓	19.00	0	1	active	2024-11-23 10:55:46.035996	2024-11-23 10:55:46.035996	http://localhost:30100/uploads/products/1/-------------------------------------1732330546036.jpg
P202411952561	抹茶蛋糕卷	配料:面粉,铁塔淡奶油,鸡蛋,白砂糖,宇治抹茶粉	11.00	0	1	active	2024-11-23 10:57:40.503167	2024-11-23 10:57:40.503167	http://localhost:30100/uploads/products/1/wechatimg292-1732330660503.jpg
P202411037690	香草奶油纸杯蛋糕	配料:面粉,鸡蛋,糖,玉米油,淡奶油,糖,天然香草荚	13.00	0	1	active	2024-11-23 10:59:04.214321	2024-11-23 10:59:04.214321	http://localhost:30100/uploads/products/1/wechatimg293-1732330744214.jpg
P202411899478	香缇奶油戚风小蛋糕	配料:面粉,鸡蛋,细砂糖,铁塔动物奶油,马达加斯加香草荚	8.00	0	1	active	2024-11-23 11:01:20.606768	2024-11-23 11:01:20.606768	http://localhost:30100/uploads/products/1/wechatimg294-1732330880606.jpg
P202411310674	Rich超浓郁巧克力曲奇	配料:比利时纯可可脂巧克力,鸡蛋,赤砂糖,巧克力豆(块),核桃	11.00	0	6	active	2024-11-23 11:04:28.113855	2024-11-23 11:04:28.113855	http://localhost:30100/uploads/products/6/wechatimg296-1732331068114.jpg
P202411651363	双重流心曲奇(巧克力+焦糖)	配料:面粉,黄油,鸡蛋,砂糖,自制海盐焦糖酱,自制黑巧克力酱	10.00	0	6	active	2024-11-23 11:06:37.302997	2024-11-23 11:06:37.302997	http://localhost:30100/uploads/products/6/wechatimg297-1732331197303.jpg
P202411097801	曲奇三重奏(原味,抹茶味,巧克力味)	配料:新西兰黄油,鸡蛋,砂糖,可可粉,抹茶粉,核桃	18.00	0	6	active	2024-11-23 11:07:42.347844	2024-11-23 11:07:42.347844	http://localhost:30100/uploads/products/6/wechatimg298-1732331262348.jpg
P202411251774	椰子花糖·司康	配料:面粉,黄油,细砂糖,蔓越莓干,蓝莓干	9.00	0	5	active	2024-11-23 11:09:35.907238	2024-11-23 11:09:35.907238	http://localhost:30100/uploads/products/5/wechatimg300-1732331375907.jpg
P202411642384	香草可露丽	配料:鸡蛋,牛奶,淡奶油,糖粉,香草荚,朗姆酒	4.00	0	5	active	2024-11-23 11:11:04.238091	2024-11-23 11:11:04.238091	http://localhost:30100/uploads/products/5/wechatimg301-1732331464238.jpg
P202411277546	开开心心玛德琳	配料:面粉,黄油,开心果酱,细砂糖,奶油奶酪,开心果碎	14.00	0	5	active	2024-11-23 11:12:16.510066	2024-11-23 11:12:16.510066	http://localhost:30100/uploads/products/5/wechatimg302-1732331536510.jpg
P202411031729	天然香草布丁	配料:奶油,淡奶油,鸡蛋,黄砂糖,马达加斯加天然香草荚	8.00	0	4	active	2024-11-23 11:14:39.923166	2024-11-23 11:14:39.923166	http://localhost:30100/uploads/products/4/wechatimg304-1732331679923.jpg
P202411750249	焦糖奶酪布丁	配料:牛奶,鸡蛋,淡奶油,卡夫奶酪,自制焦糖酱	11.00	0	4	active	2024-11-23 11:15:40.042715	2024-11-23 11:15:40.042715	http://localhost:30100/uploads/products/4/wechatimg305-1732331740042.jpg
P202411859246	茉莉烤奶(温热)	配料:牛奶,蛋白砂糖,淡奶油,茉莉花,菠萝冻干片装饰	8.00	0	4	active	2024-11-23 11:17:55.178117	2024-11-23 11:17:55.178117	http://localhost:30100/uploads/products/4/wechatimg305-1732331875178.jpg
P202411838976	水牛乳Dirty		25.00	0	7	active	2024-11-23 11:19:39.381551	2024-11-23 11:19:39.381551	http://localhost:30100/uploads/products/7/wechatimg308-1732331979381.jpg
P202411067502	黄油牛乳拿铁		27.00	0	7	active	2024-11-23 11:20:14.567403	2024-11-23 11:20:14.567403	http://localhost:30100/uploads/products/7/wechatimg309-1732332014567.jpg
P202411324686	拿铁(冷/热)		22.00	0	7	active	2024-11-23 11:21:11.65787	2024-11-23 11:21:11.65787	http://localhost:30100/uploads/products/7/wechatimg310-1732332071658.jpg
P202411067355	美式黑咖啡		15.00	0	7	active	2024-11-23 11:21:54.267583	2024-11-23 11:21:54.267583	http://localhost:30100/uploads/products/7/wechatimg311-1732332114267.jpg
P202411803582	意式咖啡(双份)		9.00	0	7	active	2024-11-23 11:22:26.264825	2024-11-23 11:22:26.264825	http://localhost:30100/uploads/products/7/wechatimg312-1732332146265.jpg
\.


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: dominikwei
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: products fk_product_category; Type: FK CONSTRAINT; Schema: public; Owner: dominikwei
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

