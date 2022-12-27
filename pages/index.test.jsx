import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import singletonRouter, { useRouter } from 'next/router';
import Home from '.';
import mockRouter from 'next-router-mock';
let { expect } = require('chai')

jest.mock('next/router', () => require('next-router-mock'));

beforeEach(() => {
  mockRouter.setCurrentUrl("/");
  render(<Home />);
});
describe("Should Search Fields initialsed", () => {
  it("Should Render Header", () => {
    expect(screen.getByText("Logger Application")).toBeInTheDocument();
  });

  it("Should Render Log ID Field", () => {
    let subTitle = screen.getAllByText(/Log Id/i);
    expect(subTitle[0]).toBeInTheDocument();
  });

  it("Should Render Application ID Field", () => {
    let subTitle = screen.getAllByText(/Application Id/i);
    expect(subTitle[0]).toBeInTheDocument();
  });

  it("Should Render Application Type Field", () => {
    let subTitle = screen.getAllByText(/Application Type/i);
    expect(subTitle[0]).toBeInTheDocument();
  });

  it("Should Render Action Type Field", () => {
    let subTitle = screen.getAllByText(/Application Type/i);
    expect(subTitle[0]).toBeInTheDocument();
  });

  it("Should Render From Datepicker Field", () => {
    let subTitle = screen.getAllByText(/From/i);
    expect(subTitle[0]).toBeInTheDocument();
  });

  it("Should Render To Datepicker Field", () => {
    let subTitle = screen.getAllByText(/To/i);
    expect(subTitle[0]).toBeInTheDocument();
  });

  it("Should Render Search Button", () => {
    let subTitle = screen.getAllByText(/search/i);
    expect(subTitle[0]).toBeInTheDocument();
  });

  it("Should Render Clear All", () => {
    let subTitle = screen.getAllByText(/clear all/i);
    expect(subTitle[0]).toBeInTheDocument();
  });
});

describe("Check Events", () => {
  it("Should Search button clicked", () => {
    const searchBTN = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchBTN);
  });

  it("Should Clear button clicked", () => {
    const clearBTN = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearBTN);
  });
});
